import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import type { BaturVariantData, ClientProfile, VariantRecommendation } from '../types/assistant.js';

const MATRIX_PATH = 'knowledge/tours/batur-sunrise/variant-matrix.md';
const REVIEW_MARKERS = ['needs_review', 'needs_import', 'needs_input', 'need_review'];

export function loadBaturVariantData(projectRoot = process.cwd()): BaturVariantData[] {
  const matrixPath = path.join(projectRoot, MATRIX_PATH);

  if (!existsSync(matrixPath)) {
    return [];
  }

  const content = readFileSync(matrixPath, 'utf8');
  const rows = content
    .split('\n')
    .filter((line) => line.trim().startsWith('| batur-variant-'));

  return rows.map(parseVariantMatrixRow);
}

export function recommendBaturVariants(
  profile: ClientProfile,
  variants: BaturVariantData[] = loadBaturVariantData(),
): VariantRecommendation[] {
  return variants
    .map((variant) => scoreVariant(profile, variant))
    .sort((a, b) => b.score - a.score || a.variantId.localeCompare(b.variantId))
    .map((recommendation, index) => ({
      ...recommendation,
      rank: index + 1,
    }));
}

function parseVariantMatrixRow(row: string): BaturVariantData {
  const cells = row
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());

  return {
    variantId: cells[0] ?? '',
    sourceUrl: cells[1] ?? '',
    exactSiteName: cells[2] ?? '',
    format: cells[3] ?? '',
    transferIncluded: cells[4] ?? '',
    hotSpringsIncluded: cells[5] ?? '',
    privateOrGroup: cells[6] ?? '',
    pickupAreaRules: cells[7] ?? '',
    duration: cells[8] ?? '',
    price: cells[9] ?? '',
    included: cells[10] ?? '',
    notIncluded: cells[11] ?? '',
    cancellationRules: cells[12] ?? '',
    bestFor: cells[13] ?? '',
    notGoodFor: cells[14] ?? '',
    recommendedFor: cells[15] ?? '',
    notRecommendedFor: cells[16] ?? '',
    decisionSummary: cells[17] ?? '',
    managerPriority: cells[18] ?? '',
    managerNotes: cells[19] ?? '',
    status: cells[20] ?? '',
  };
}

function scoreVariant(profile: ClientProfile, variant: BaturVariantData): VariantRecommendation {
  const matchedReasons: string[] = [];
  const missingFacts: string[] = [];
  const internalWarnings: string[] = [];
  let score = 0;

  if (profile.needsTransfer === true) {
    if (isConfirmedYes(variant.transferIncluded)) {
      score += 30;
      matchedReasons.push('Клиенту может быть нужен трансфер, и у варианта трансфер подтвержден.');
    } else if (isConfirmedNo(variant.transferIncluded)) {
      score -= 40;
      internalWarnings.push('Клиенту может быть нужен трансфер, а у варианта трансфер не подтвержден как включенный.');
    } else {
      missingFacts.push('transfer_included');
      missingFacts.push('pickup_area_rules');
    }
  }

  if (profile.ownTransport === true) {
    score += 8;
    matchedReasons.push('Клиент сообщил, что может добраться самостоятельно.');

    if (profile.budget === 'lowest_price' || profile.budget === 'budget_sensitive') {
      if (isReviewNeeded(variant.price)) {
        missingFacts.push('price');
      } else {
        score += 15;
        matchedReasons.push('Для бюджетного запроса можно сравнить подтвержденную цену варианта.');
      }
    }
  }

  if (profile.ownTransport !== true && mentionsMeetingAtBase(variant)) {
    score -= 35;
    internalWarnings.push('Не рекомендовать формат встречи на базе без подтверждения, что клиент может добраться самостоятельно.');
  }

  if (profile.wantsHotSprings === true) {
    if (isConfirmedYes(variant.hotSpringsIncluded)) {
      score += 35;
      matchedReasons.push('Клиент хочет горячие источники, и у варианта они подтверждены.');
    } else if (isConfirmedNo(variant.hotSpringsIncluded)) {
      score -= 45;
      internalWarnings.push('Клиент хочет горячие источники, а у варианта они не подтверждены как включенные.');
    } else {
      missingFacts.push('hot_springs_included');
    }
  }

  if (profile.formatPreference === 'private') {
    score += scoreTextMatch(variant.privateOrGroup, ['private', 'приват', 'индивиду']);
    if (isReviewNeeded(variant.privateOrGroup)) {
      missingFacts.push('private_or_group');
    }
  }

  if (profile.formatPreference === 'group') {
    score += scoreTextMatch(variant.privateOrGroup, ['group', 'групп']);
    if (isReviewNeeded(variant.privateOrGroup)) {
      missingFacts.push('private_or_group');
    }
  }

  if (profile.formatPreference === 'no_hike') {
    const noHikeScore = scoreTextMatch(variant.format, ['без восхождения', 'без подъема', 'jeep', 'джип']);
    score += noHikeScore;
    if (noHikeScore === 0) {
      missingFacts.push('format');
    }
  }

  if (profile.formatPreference === 'trekking') {
    score += scoreTextMatch(variant.format, ['trekking', 'треккинг', 'восхождение', 'подъем']);
    if (isReviewNeeded(variant.format)) {
      missingFacts.push('format');
    }
  }

  if (profile.children !== null || profile.childAges.length > 0) {
    missingFacts.push('age_restrictions');
    internalWarnings.push('Есть ребенок: возрастные правила и нагрузку нужно проверить вручную.');
  }

  if (profile.healthOrFitnessLimitations.length > 0) {
    missingFacts.push('health_and_fitness_restrictions');
    internalWarnings.push('Есть ограничения по здоровью или физической форме: не рекомендовать треккинг без уточнения.');
    score -= 20;
  }

  for (const field of getAlwaysRequiredUnknownFacts(variant)) {
    missingFacts.push(field);
  }

  const uniqueMissingFacts = unique(missingFacts);
  const uniqueWarnings = unique(internalWarnings);
  const requiresReview = uniqueMissingFacts.length > 0 || isReviewNeeded(variant.status);
  const isUnsuitable = uniqueWarnings.some((warning) => warning.includes('не подтвержден')) && !requiresReview;

  return {
    variantId: variant.variantId,
    sourceUrl: variant.sourceUrl,
    score: score - uniqueMissingFacts.length * 3,
    rank: 0,
    status: isUnsuitable ? 'unsuitable' : requiresReview ? 'candidate_needs_review' : 'suitable',
    requiresReview,
    matchedReasons,
    missingFacts: uniqueMissingFacts,
    internalWarnings: uniqueWarnings,
  };
}

function getAlwaysRequiredUnknownFacts(variant: BaturVariantData): string[] {
  const fields: [string, string][] = [
    ['exact_site_name', variant.exactSiteName],
    ['availability', variant.status],
  ];

  return fields.filter(([, value]) => isReviewNeeded(value)).map(([field]) => field);
}

function scoreTextMatch(value: string, needles: string[]): number {
  const normalizedValue = normalize(value);
  return needles.some((needle) => normalizedValue.includes(normalize(needle))) ? 20 : 0;
}

function mentionsMeetingAtBase(variant: BaturVariantData): boolean {
  const text = normalize(`${variant.format} ${variant.pickupAreaRules} ${variant.recommendedFor} ${variant.decisionSummary}`);
  return text.includes('встреч') && (text.includes('баз') || text.includes('мест'));
}

function isConfirmedYes(value: string): boolean {
  const normalizedValue = normalize(value);
  return ['yes', 'true', 'included', 'включено', 'да'].some((needle) => normalizedValue.includes(needle));
}

function isConfirmedNo(value: string): boolean {
  const normalizedValue = normalize(value);
  return ['no', 'false', 'not included', 'не включено', 'нет'].some((needle) => normalizedValue.includes(needle));
}

function isReviewNeeded(value: string): boolean {
  const normalizedValue = normalize(value);
  return !normalizedValue || REVIEW_MARKERS.some((marker) => normalizedValue.includes(marker));
}

function normalize(value: string): string {
  return value.toLocaleLowerCase('ru-RU').replaceAll('ё', 'е');
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values));
}
