import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { analyzeClientMessage } from '../lib/analyzeClientMessage.js';
import type { ManagerAnalysis } from '../types/assistant.js';

interface ClientAnalysisCase {
  id: string;
  message: string;
  expected: {
    clientLanguage?: string;
    intentsInclude?: string[];
    profile?: Record<string, unknown>;
    healthIncludes?: string[];
    missingFieldsInclude?: string[];
    missingFieldsExact?: string[];
    warningsInclude?: string[];
    nextAction?: string;
    maxClarificationQuestions?: number;
  };
}

interface ClientAnalysisCasesFile {
  cases: ClientAnalysisCase[];
}

interface TestFailure {
  id: string;
  reason: string;
}

const casesFile = JSON.parse(
  readFileSync('tests/batur/client-analysis-cases.json', 'utf8'),
) as ClientAnalysisCasesFile;

const failures: TestFailure[] = [];

for (const testCase of casesFile.cases) {
  try {
    const analysis = analyzeClientMessage({ message: testCase.message });
    assertClientAnalysis(testCase, analysis);
  } catch (error) {
    failures.push({
      id: testCase.id,
      reason: error instanceof Error ? error.message : String(error),
    });
  }
}

const passed = casesFile.cases.length - failures.length;

console.log('Client analysis test results');
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
console.log('Coverage gaps: phrase matching is deterministic; date normalization, spelling variants, and full dialogue context are not covered yet.');

function assertClientAnalysis(testCase: ClientAnalysisCase, analysis: ManagerAnalysis): void {
  const { expected } = testCase;

  if (expected.clientLanguage !== undefined) {
    assert.equal(analysis.clientLanguage, expected.clientLanguage, 'clientLanguage mismatch');
  }

  for (const intent of expected.intentsInclude ?? []) {
    assert.ok(
      analysis.intents.some((actualIntent) => actualIntent.type === intent),
      `missing intent: ${intent}`,
    );
  }

  for (const [field, expectedValue] of Object.entries(expected.profile ?? {})) {
    assert.deepEqual(
      analysis.profile[field as keyof typeof analysis.profile],
      expectedValue,
      `profile.${field} mismatch`,
    );
  }

  for (const healthValue of expected.healthIncludes ?? []) {
    assert.ok(
      analysis.profile.healthOrFitnessLimitations.includes(healthValue),
      `missing health limitation: ${healthValue}`,
    );
  }

  const missingFields = analysis.missingInformation.map((item) => item.field);

  for (const field of expected.missingFieldsInclude ?? []) {
    assert.ok(missingFields.includes(field), `missing clarification field: ${field}`);
  }

  if (expected.missingFieldsExact !== undefined) {
    assert.deepEqual(missingFields, expected.missingFieldsExact, 'missing fields mismatch');
  }

  for (const warningNeedle of expected.warningsInclude ?? []) {
    assert.ok(
      analysis.internalWarnings.some((warning) => warning.toLocaleLowerCase('ru-RU').includes(warningNeedle.toLocaleLowerCase('ru-RU'))),
      `missing warning containing: ${warningNeedle}`,
    );
  }

  if (expected.nextAction !== undefined) {
    assert.equal(analysis.nextBestAction.type, expected.nextAction, 'next action mismatch');
  }

  if (expected.maxClarificationQuestions !== undefined) {
    assert.ok(
      analysis.missingInformation.length <= expected.maxClarificationQuestions,
      `too many clarification questions: ${analysis.missingInformation.length}`,
    );
    assert.ok(
      analysis.nextBestAction.questions.length <= expected.maxClarificationQuestions,
      `too many next-action questions: ${analysis.nextBestAction.questions.length}`,
    );
  }
}
