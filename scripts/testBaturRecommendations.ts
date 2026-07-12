import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { analyzeClientMessage } from '../lib/analyzeClientMessage.js';
import { recommendBaturVariants } from '../lib/recommendBaturVariant.js';
import type { BaturVariantData, ClientProfile, VariantRecommendation } from '../types/assistant.js';

interface RecommendationCasesFile {
  variantFixtures: Record<string, BaturVariantData>;
  cases: RecommendationCase[];
}

interface RecommendationCase {
  id: string;
  message?: string;
  profile?: Partial<ClientProfile>;
  variants?: string[];
  expected: {
    topVariantId?: string;
    nextAction?: string;
    noSuitableVariants?: boolean;
    noPositiveSafetyConfirmation?: boolean;
    variantStatuses?: Record<string, VariantRecommendation['status']>;
    missingFactsInclude?: Record<string, string[]>;
    warningsInclude?: Record<string, string[]> | string[];
  };
}

interface TestFailure {
  id: string;
  reason: string;
}

const casesFile = JSON.parse(
  readFileSync('tests/batur/recommendation-cases.json', 'utf8'),
) as RecommendationCasesFile;

const failures: TestFailure[] = [];

for (const testCase of casesFile.cases) {
  try {
    if (testCase.message) {
      assertIntegratedRecommendationCase(testCase);
    } else {
      assertVariantRecommendationCase(testCase, casesFile.variantFixtures);
    }
  } catch (error) {
    failures.push({
      id: testCase.id,
      reason: error instanceof Error ? error.message : String(error),
    });
  }
}

const passed = casesFile.cases.length - failures.length;

console.log('Batur recommendation test results');
console.log(`Total cases: ${casesFile.cases.length}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failures.length}`);

if (failures.length > 0) {
  console.log('Failure reasons:');
  for (const failure of failures) {
    console.log(`- ${failure.id}: ${failure.reason}`);
  }
  process.exit(1);
}

console.log('Failure reasons: none');
console.log('Coverage gaps: fixtures cover ranking rules, not real product facts; numeric price comparison and live availability are not implemented yet.');

function assertVariantRecommendationCase(
  testCase: RecommendationCase,
  variantFixtures: Record<string, BaturVariantData>,
): void {
  const profile = createClientProfile(testCase.profile ?? {});
  const variants = (testCase.variants ?? []).map((variantId) => {
    const variant = variantFixtures[variantId];
    assert.ok(variant, `unknown variant fixture: ${variantId}`);
    return variant;
  });

  const recommendations = recommendBaturVariants(profile, variants);
  const recommendationById = new Map(recommendations.map((recommendation) => [recommendation.variantId, recommendation]));

  if (testCase.expected.topVariantId !== undefined) {
    assert.equal(recommendations[0]?.variantId, testCase.expected.topVariantId, 'top variant mismatch');
  }

  if (testCase.expected.noSuitableVariants) {
    assert.equal(
      recommendations.some((recommendation) => recommendation.status === 'suitable'),
      false,
      'expected no suitable variants',
    );
  }

  for (const [variantId, expectedStatus] of Object.entries(testCase.expected.variantStatuses ?? {})) {
    assert.equal(
      recommendationById.get(variantId)?.status,
      expectedStatus,
      `status mismatch for ${variantId}`,
    );
  }

  for (const [variantId, expectedMissingFacts] of Object.entries(testCase.expected.missingFactsInclude ?? {})) {
    const recommendation = recommendationById.get(variantId);
    assert.ok(recommendation, `missing recommendation for ${variantId}`);

    for (const missingFact of expectedMissingFacts) {
      assert.ok(
        recommendation.missingFacts.includes(missingFact),
        `missing fact ${missingFact} for ${variantId}`,
      );
    }
  }

  const warningsByVariant = testCase.expected.warningsInclude;

  if (warningsByVariant && !Array.isArray(warningsByVariant)) {
    for (const [variantId, expectedWarnings] of Object.entries(warningsByVariant)) {
      const recommendation = recommendationById.get(variantId);
      assert.ok(recommendation, `missing recommendation for ${variantId}`);

      for (const warningNeedle of expectedWarnings) {
        assert.ok(
          recommendation.internalWarnings.some((warning) => includesIgnoreCase(warning, warningNeedle)),
          `missing warning "${warningNeedle}" for ${variantId}`,
        );
      }
    }
  }
}

function assertIntegratedRecommendationCase(testCase: RecommendationCase): void {
  const analysis = analyzeClientMessage({ message: testCase.message ?? '' });

  if (testCase.expected.nextAction !== undefined) {
    assert.equal(analysis.nextBestAction.type, testCase.expected.nextAction, 'next action mismatch');
  }

  if (testCase.expected.noPositiveSafetyConfirmation) {
    assert.notEqual(analysis.nextBestAction.type, 'recommend_variant', 'safety question must not recommend a variant');
    assert.ok(
      analysis.internalWarnings.some((warning) => includesIgnoreCase(warning, 'Не подтверждать безопасность')),
      'safety warning missing',
    );
  }

  const warnings = testCase.expected.warningsInclude;
  if (Array.isArray(warnings)) {
    for (const warningNeedle of warnings) {
      assert.ok(
        analysis.internalWarnings.some((warning) => includesIgnoreCase(warning, warningNeedle)),
        `missing warning containing: ${warningNeedle}`,
      );
    }
  }
}

function createClientProfile(overrides: Partial<ClientProfile>): ClientProfile {
  return {
    language: 'ru',
    intents: [],
    travelDate: null,
    guestCount: null,
    adults: null,
    children: null,
    childAges: [],
    hotelArea: null,
    ownTransport: null,
    needsTransfer: null,
    wantsHotSprings: null,
    formatPreference: null,
    budget: null,
    healthOrFitnessLimitations: [],
    otherConstraints: [],
    ...overrides,
  };
}

function includesIgnoreCase(value: string, needle: string): boolean {
  return value.toLocaleLowerCase('ru-RU').includes(needle.toLocaleLowerCase('ru-RU'));
}
