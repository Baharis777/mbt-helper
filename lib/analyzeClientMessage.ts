import type {
  BudgetPreference,
  ClientConstraint,
  ClientIntent,
  ClientIntentType,
  ClientLanguage,
  ClientProfile,
  ManagerAnalysis,
  TourFormatPreference,
} from '../types/assistant.js';
import { getMissingInformation } from './getMissingInformation.js';
import { getNextBestAction } from './getNextBestAction.js';
import { loadBaturVariantData, recommendBaturVariants } from './recommendBaturVariant.js';

export interface AnalyzeClientMessageInput {
  message: string;
}

interface PatternGroup {
  type: ClientIntentType;
  confidence: number;
  patterns: RegExp[];
}

const INTENT_PATTERNS: PatternGroup[] = [
  {
    type: 'mount_batur',
    confidence: 0.95,
    patterns: [/батур/u, /\bbatur\b/u, /вулкан/u],
  },
  {
    type: 'sunrise_trekking',
    confidence: 0.9,
    patterns: [/рассвет/u, /восхожд/u, /треккинг/u, /\btrekking\b/u, /\bsunrise\b/u],
  },
  {
    type: 'hot_springs',
    confidence: 0.95,
    patterns: [/горяч[\p{L}]*\s+источн/u, /термаль[\p{L}]*\s+источн/u, /\bhot springs\b/u, /купальн/u],
  },
  {
    type: 'no_hike_or_jeep',
    confidence: 0.9,
    patterns: [/без восхожд/u, /без подъ[её]м/u, /не хотим идти пешком/u, /не хочу идти пешком/u, /джип/u, /\bjeep\b/u],
  },
  {
    type: 'price',
    confidence: 0.85,
    patterns: [/цена/u, /стоимость/u, /сколько стоит/u, /прайс/u, /недорого/u, /бюджет/u, /самый дешев/u, /\bprice\b/u, /\bcost\b/u, /\bexpensive\b/u],
  },
  {
    type: 'booking',
    confidence: 0.85,
    patterns: [/забронировать/u, /бронь/u, /оплат/u, /\bbook\b/u, /\bbooking\b/u],
  },
  {
    type: 'availability',
    confidence: 0.85,
    patterns: [/доступно/u, /есть места/u, /наличие/u, /\bavailable\b/u, /\bavailability\b/u],
  },
  {
    type: 'safety',
    confidence: 0.95,
    patterns: [/безопас/u, /изверж/u, /дым/u, /пепел/u, /активен/u, /открыт ли маршрут/u, /закрыт/u, /\bsafety\b/u, /\bsafe\b/u, /\beruption\b/u, /\bash\b/u, /\bsmoke\b/u],
  },
  {
    type: 'transfer',
    confidence: 0.8,
    patterns: [/трансфер/u, /забрать из отел/u, /из отел/u, /жив[её]м в/u, /\bhotel pickup\b/u, /\bpickup\b/u],
  },
];

const HOTEL_AREAS: [string, RegExp[]][] = [
  ['Canggu', [/чангу/u, /\bcanggu\b/u]],
  ['Ubud', [/убуд/u, /\bubud\b/u]],
  ['Seminyak', [/семиньяк/u, /\bseminyak\b/u]],
  ['Nusa Dua', [/нуса дуа/u, /\bnusa dua\b/u]],
  ['Kuta', [/кута/u, /\bkuta\b/u]],
  ['Sanur', [/санур/u, /\bsanur\b/u]],
  ['Uluwatu', [/улувату/u, /\buluwatu\b/u]],
  ['Kintamani', [/кинтамани/u, /\bkintamani\b/u]],
];

export function analyzeClientMessage(input: AnalyzeClientMessageInput): ManagerAnalysis {
  const message = input.message.trim();
  const normalizedMessage = normalize(message);
  const intents = extractIntents(normalizedMessage);
  const profile = buildClientProfile(message, normalizedMessage, intents);
  const constraints = buildConstraints(profile, intents);
  const internalWarnings = buildInternalWarnings(profile, intents);
  const variants = loadBaturVariantData();
  const variantRecommendations = recommendBaturVariants(profile, variants);
  const missingInformation = getMissingInformation(profile);
  const nextBestAction = getNextBestAction(profile, missingInformation, variantRecommendations);

  return {
    clientLanguage: profile.language,
    intents,
    profile,
    constraints,
    missingInformation,
    internalWarnings,
    suitableVariants: variantRecommendations.filter((variant) => variant.status !== 'unsuitable').slice(0, 5),
    unsuitableVariants: variantRecommendations.filter((variant) => variant.status === 'unsuitable'),
    nextBestAction,
    knowledgeRefs: [
      'knowledge/tours/batur-sunrise/variant-matrix.md',
      'knowledge/rules/batur-recommendation-rules.md',
      'knowledge/sales/sales-principles.md',
    ],
    notes: [
      'Анализ выполнен deterministic keyword matching без OpenAI.',
      'Если свойства варианта NEEDS_REVIEW, вариант нельзя обещать клиенту как подтвержденный.',
    ],
  };
}

function buildClientProfile(message: string, normalizedMessage: string, intents: ClientIntent[]): ClientProfile {
  const ownTransport = extractOwnTransport(normalizedMessage);
  const hotelArea = extractHotelArea(normalizedMessage);
  const children = extractChildrenCount(normalizedMessage);
  const childAges = extractChildAges(normalizedMessage);
  const guestCount = extractGuestCount(normalizedMessage);
  const healthOrFitnessLimitations = extractHealthLimitations(normalizedMessage);
  const formatPreference = extractFormatPreference(normalizedMessage);
  const budget = extractBudgetPreference(normalizedMessage);
  const wantsHotSprings = hasIntent(intents, 'hot_springs') ? true : null;
  const explicitTransfer = /нужен трансфер|трансфер|забрать из отел|hotel pickup|pickup/u.test(normalizedMessage);
  const needsTransfer = ownTransport === true ? false : explicitTransfer || hotelArea !== null ? true : null;

  return {
    language: detectLanguage(message),
    intents,
    travelDate: extractTravelDate(normalizedMessage),
    guestCount,
    adults: guestCount !== null && children !== null ? Math.max(guestCount - children, 0) : null,
    children,
    childAges,
    hotelArea,
    ownTransport,
    needsTransfer,
    wantsHotSprings,
    formatPreference,
    budget,
    healthOrFitnessLimitations,
    otherConstraints: extractOtherConstraints(normalizedMessage),
  };
}

function extractIntents(normalizedMessage: string): ClientIntent[] {
  return INTENT_PATTERNS.flatMap((group) => {
    const matchedPhrases = group.patterns
      .filter((pattern) => pattern.test(normalizedMessage))
      .map((pattern) => pattern.source.replaceAll('\\b', '').replaceAll('\\', ''));

    if (matchedPhrases.length === 0) {
      return [];
    }

    return [{
      type: group.type,
      confidence: group.confidence,
      matchedPhrases,
    }];
  });
}

function buildConstraints(profile: ClientProfile, intents: ClientIntent[]): ClientConstraint[] {
  const constraints: ClientConstraint[] = [];

  if (profile.travelDate === null && (hasIntent(intents, 'booking') || hasIntent(intents, 'availability') || hasIntent(intents, 'mount_batur'))) {
    constraints.push({
      type: 'travel_date',
      value: 'missing',
      severity: 'warning',
      reason: 'Без даты нельзя проверить доступность и актуальные условия.',
    });
  }

  if (profile.needsTransfer === true) {
    constraints.push({
      type: 'transport',
      value: profile.hotelArea ? `needs_transfer_from_${profile.hotelArea}` : 'needs_transfer',
      severity: 'info',
      reason: 'Трансфер может влиять на выбор варианта.',
    });
  }

  if (profile.wantsHotSprings === true) {
    constraints.push({
      type: 'format',
      value: 'wants_hot_springs',
      severity: 'info',
      reason: 'Нужен вариант, где горячие источники подтверждены.',
    });
  }

  if (profile.budget !== null) {
    constraints.push({
      type: 'budget',
      value: profile.budget,
      severity: 'info',
      reason: 'Бюджет влияет на порядок проверки вариантов, но не должен быть единственным критерием.',
    });
  }

  if (profile.children !== null || profile.childAges.length > 0) {
    constraints.push({
      type: 'children',
      value: profile.childAges.length > 0 ? profile.childAges.join(', ') : 'mentioned',
      severity: 'warning',
      reason: 'Возрастные правила и нагрузка требуют проверки.',
    });
  }

  if (profile.healthOrFitnessLimitations.length > 0) {
    constraints.push({
      type: 'health',
      value: profile.healthOrFitnessLimitations.join(', '),
      severity: 'blocking',
      reason: 'Нельзя рекомендовать треккинг без уточнения ограничения.',
    });
  }

  if (hasIntent(intents, 'safety')) {
    constraints.push({
      type: 'safety',
      value: 'current_status_question',
      severity: 'blocking',
      reason: 'Текущая безопасность требует ручной live-проверки.',
    });
  }

  return constraints;
}

function buildInternalWarnings(profile: ClientProfile, intents: ClientIntent[]): string[] {
  const warnings: string[] = [];

  if (hasIntent(intents, 'safety')) {
    warnings.push('Не подтверждать безопасность, открытый маршрут, доступность или проведение тура без live-проверки.');
  }

  if (profile.children !== null || profile.childAges.length > 0) {
    warnings.push('Есть ребенок: проверить возрастные ограничения, нагрузку и правила конкретного варианта.');
  }

  if (profile.healthOrFitnessLimitations.length > 0) {
    warnings.push('Есть ограничения по здоровью или физической форме: треккинг нельзя рекомендовать без уточнений.');
  }

  if (profile.wantsHotSprings === true) {
    warnings.push('Горячие источники можно обещать только если они подтверждены в конкретном варианте.');
  }

  return warnings;
}

function detectLanguage(message: string): ClientLanguage {
  if (/[а-яё]/iu.test(message)) {
    return 'ru';
  }

  if (/\b(saya|kami|mau|bisa|berapa|dari)\b/iu.test(message)) {
    return 'id';
  }

  if (/[a-z]/iu.test(message)) {
    return 'en';
  }

  return 'unknown';
}

function extractTravelDate(normalizedMessage: string): string | null {
  if (/сегодня|today/u.test(normalizedMessage)) {
    return 'today';
  }

  if (/завтра|tomorrow/u.test(normalizedMessage)) {
    return 'tomorrow';
  }

  const dateMatch = normalizedMessage.match(/\b\d{1,2}[./-]\d{1,2}(?:[./-]\d{2,4})?\b/u);
  return dateMatch?.[0] ?? null;
}

function extractGuestCount(normalizedMessage: string): number | null {
  if (/нас двое|мы вдвоем|мы вдвоём|2 человека|два человека|two of us/u.test(normalizedMessage)) {
    return 2;
  }

  const guestMatch = normalizedMessage.match(/\b(\d{1,2})\s*(?:человека|человек|гостя|гостей|pax|people)\b/u);
  return guestMatch?.[1] ? Number(guestMatch[1]) : null;
}

function extractChildrenCount(normalizedMessage: string): number | null {
  if (/ребен|ребён|дети|child|kids|семья/u.test(normalizedMessage)) {
    const childCountMatch = normalizedMessage.match(/\b(\d{1,2})\s*(?:ребен|ребён|дет|child|kids)/u);
    return childCountMatch?.[1] ? Number(childCountMatch[1]) : 1;
  }

  return null;
}

function extractChildAges(normalizedMessage: string): number[] {
  const ages = new Set<number>();
  const patterns = [
    /(?:ребенку|ребёнку|ребенок|ребёнок|child)\D{0,12}(\d{1,2})\s*(?:лет|года|год|yo)?/gu,
    /(\d{1,2})\s*(?:лет|года|год|yo)\D{0,16}(?:ребен|ребён|child)/gu,
  ];

  for (const pattern of patterns) {
    for (const match of normalizedMessage.matchAll(pattern)) {
      if (match[1]) {
        ages.add(Number(match[1]));
      }
    }
  }

  return Array.from(ages);
}

function extractHotelArea(normalizedMessage: string): string | null {
  for (const [area, patterns] of HOTEL_AREAS) {
    if (patterns.some((pattern) => pattern.test(normalizedMessage))) {
      return area;
    }
  }

  return null;
}

function extractOwnTransport(normalizedMessage: string): boolean | null {
  if (/сами добер[её]мся|самостоятельно добер|свой транспорт|на своей машине|own transport/u.test(normalizedMessage)) {
    return true;
  }

  if (/нужен трансфер|забрать из отел|hotel pickup|pickup/u.test(normalizedMessage)) {
    return false;
  }

  return null;
}

function extractFormatPreference(normalizedMessage: string): TourFormatPreference {
  if (/индивидуальн|приват|private/u.test(normalizedMessage)) {
    return 'private';
  }

  if (/группов|group/u.test(normalizedMessage)) {
    return 'group';
  }

  if (/без восхожд|без подъ[её]м|не хотим идти пешком|не хочу идти пешком|джип|jeep/u.test(normalizedMessage)) {
    return 'no_hike';
  }

  if (/восхожд|треккинг|trekking|подняться|рассвет/u.test(normalizedMessage)) {
    return 'trekking';
  }

  return null;
}

function extractBudgetPreference(normalizedMessage: string): BudgetPreference {
  if (/самый дешев|дешевле всего|lowest|cheapest/u.test(normalizedMessage)) {
    return 'lowest_price';
  }

  if (/недорого|бюджет|дорого|expensive|price|цена|стоимость/u.test(normalizedMessage)) {
    return 'budget_sensitive';
  }

  return null;
}

function extractHealthLimitations(normalizedMessage: string): string[] {
  const limitations: string[] = [];

  if (/колен|knees/u.test(normalizedMessage)) {
    limitations.push('knees');
  }

  if (/беремен|pregnant/u.test(normalizedMessage)) {
    limitations.push('pregnancy');
  }

  if (/пожил|elderly/u.test(normalizedMessage)) {
    limitations.push('elderly_guest');
  }

  if (/физическ|подготовк|не хотим идти пешком|не хочу идти пешком|тяжело идти/u.test(normalizedMessage)) {
    limitations.push('fitness_or_walking_limit');
  }

  return limitations;
}

function extractOtherConstraints(normalizedMessage: string): string[] {
  const constraints: string[] = [];

  if (/коротк.*график|мало времени|short schedule/u.test(normalizedMessage)) {
    constraints.push('short_schedule');
  }

  return constraints;
}

function hasIntent(intents: ClientIntent[], type: ClientIntentType): boolean {
  return intents.some((intent) => intent.type === type);
}

function normalize(value: string): string {
  return value.toLocaleLowerCase('ru-RU').replaceAll('ё', 'е');
}
