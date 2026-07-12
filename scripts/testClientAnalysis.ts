import assert from 'node:assert/strict';
import { inspect } from 'node:util';
import { analyzeClientMessage } from '../lib/analyzeClientMessage.js';

const testCases = [
  {
    name: 'Batur with hot springs and Canggu',
    message: 'Нас двое, живем в Чангу, хотим Батур с горячими источниками.',
    expected: [
      'guest_count: 2',
      'hotel_area: Canggu',
      'wants_hot_springs: true',
      'travel_date missing',
      'variant with transfer and hot springs preferred, but facts may require review',
    ],
  },
  {
    name: 'Lowest price with own transport',
    message: 'Хотим самый дешевый вариант, сами доберемся.',
    expected: [
      'budget priority',
      'own transport: true',
      'meeting-at-base variant may be suitable only after facts are confirmed',
    ],
  },
  {
    name: 'Child age',
    message: 'Можно ли ребенку 6 лет?',
    expected: [
      'child mentioned',
      'child age: 6',
      'internal warning',
      'manual clarification or review required',
    ],
  },
  {
    name: 'Current safety',
    message: 'Сейчас безопасно подниматься на Батур?',
    expected: [
      'safety intent',
      'check_live_status',
      'no safety confirmation',
    ],
  },
  {
    name: 'Bad knees but sunrise',
    message: 'У меня проблемы с коленями, но хочу встретить рассвет.',
    expected: [
      'health constraint',
      'trekking should not be recommended without clarification',
      'internal warning',
    ],
  },
];

for (const testCase of testCases) {
  const analysis = analyzeClientMessage({ message: testCase.message });

  console.log(`\n## ${testCase.name}`);
  console.log(`Message: ${testCase.message}`);
  console.log('Expected:');
  for (const expected of testCase.expected) {
    console.log(`- ${expected}`);
  }

  console.log('Analysis summary:');
  console.log(inspect({
    clientLanguage: analysis.clientLanguage,
    intents: analysis.intents.map((intent) => intent.type),
    profile: {
      travelDate: analysis.profile.travelDate,
      guestCount: analysis.profile.guestCount,
      children: analysis.profile.children,
      childAges: analysis.profile.childAges,
      hotelArea: analysis.profile.hotelArea,
      ownTransport: analysis.profile.ownTransport,
      needsTransfer: analysis.profile.needsTransfer,
      wantsHotSprings: analysis.profile.wantsHotSprings,
      formatPreference: analysis.profile.formatPreference,
      budget: analysis.profile.budget,
      healthOrFitnessLimitations: analysis.profile.healthOrFitnessLimitations,
    },
    missingInformation: analysis.missingInformation,
    internalWarnings: analysis.internalWarnings,
    nextBestAction: analysis.nextBestAction,
    topVariants: analysis.suitableVariants.slice(0, 3).map((variant) => ({
      variantId: variant.variantId,
      score: variant.score,
      status: variant.status,
      requiresReview: variant.requiresReview,
      missingFacts: variant.missingFacts,
    })),
  }, { depth: null, colors: false }));

  runAssertions(testCase.name, analysis);
}

function runAssertions(name: string, analysis: ReturnType<typeof analyzeClientMessage>): void {
  if (name === 'Batur with hot springs and Canggu') {
    assert.equal(analysis.profile.guestCount, 2);
    assert.equal(analysis.profile.hotelArea, 'Canggu');
    assert.equal(analysis.profile.wantsHotSprings, true);
    assert.equal(analysis.profile.travelDate, null);
    assert.equal(analysis.nextBestAction.type, 'ask_clarification');
    assert.ok(analysis.suitableVariants.some((variant) => variant.missingFacts.includes('hot_springs_included')));
  }

  if (name === 'Lowest price with own transport') {
    assert.equal(analysis.profile.budget, 'lowest_price');
    assert.equal(analysis.profile.ownTransport, true);
    assert.ok(analysis.suitableVariants.some((variant) => variant.missingFacts.includes('price')));
  }

  if (name === 'Child age') {
    assert.equal(analysis.profile.children, 1);
    assert.deepEqual(analysis.profile.childAges, [6]);
    assert.equal(analysis.nextBestAction.type, 'manual_review');
    assert.ok(analysis.internalWarnings.length > 0);
  }

  if (name === 'Current safety') {
    assert.ok(analysis.intents.some((intent) => intent.type === 'safety'));
    assert.equal(analysis.nextBestAction.type, 'check_live_status');
    assert.ok(analysis.internalWarnings.some((warning) => warning.includes('Не подтверждать безопасность')));
  }

  if (name === 'Bad knees but sunrise') {
    assert.ok(analysis.profile.healthOrFitnessLimitations.includes('knees'));
    assert.equal(analysis.nextBestAction.type, 'ask_clarification');
    assert.ok(analysis.internalWarnings.some((warning) => warning.includes('треккинг нельзя рекомендовать')));
  }
}
