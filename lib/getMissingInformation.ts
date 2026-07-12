import type { ClientProfile, MissingInformation } from '../types/assistant.js';

const MAX_QUESTIONS = 3;

export function getMissingInformation(profile: ClientProfile): MissingInformation[] {
  const missing: MissingInformation[] = [];
  const intentTypes = new Set(profile.intents.map((intent) => intent.type));
  const hasBookingOrAvailabilityIntent = intentTypes.has('booking') || intentTypes.has('availability');
  const hasPriceIntent = intentTypes.has('price');
  const hasBaturIntent = intentTypes.has('mount_batur') || intentTypes.has('sunrise_trekking') || intentTypes.has('hot_springs');
  const safetyOnly =
    intentTypes.has('safety') &&
    !hasBookingOrAvailabilityIntent &&
    !hasPriceIntent &&
    !intentTypes.has('hot_springs') &&
    profile.healthOrFitnessLimitations.length === 0 &&
    profile.children === null &&
    profile.childAges.length === 0;

  if (safetyOnly) {
    return [];
  }

  if (
    profile.travelDate === null &&
    (hasBaturIntent || hasBookingOrAvailabilityIntent || hasPriceIntent)
  ) {
    missing.push({
      field: 'travel_date',
      priority: 'high',
      question: 'На какую дату планируете поездку?',
      reason: 'Дата нужна для проверки доступности, актуальной цены и операционных условий.',
    });
  }

  if (profile.children !== null && profile.childAges.length === 0) {
    missing.push({
      field: 'child_age',
      priority: 'high',
      question: 'Сколько лет ребенку?',
      reason: 'Возраст ребенка влияет на допустимость участия, нагрузку и необходимость ручной проверки.',
    });
  }

  if (profile.healthOrFitnessLimitations.length > 0) {
    missing.push({
      field: 'health_details',
      priority: 'high',
      question: 'Насколько сильное ограничение по здоровью или физической нагрузке?',
      reason: 'Ограничения по здоровью влияют на то, можно ли предлагать треккинг без дополнительной проверки.',
    });
  }

  if (profile.hotelArea === null && profile.ownTransport !== true && (profile.needsTransfer === true || hasBaturIntent)) {
    missing.push({
      field: 'hotel_area',
      priority: 'medium',
      question: 'В каком районе вы остановитесь?',
      reason: 'Район нужен, чтобы понять трансфер и подобрать подходящий вариант.',
    });
  }

  if (profile.guestCount === null && (hasBaturIntent || hasBookingOrAvailabilityIntent || hasPriceIntent)) {
    missing.push({
      field: 'guest_count',
      priority: 'medium',
      question: 'Сколько человек планирует поездку?',
      reason: 'Количество гостей влияет на проверку цены, транспорта и бронирования.',
    });
  }

  if (profile.ownTransport === null && profile.needsTransfer === null && hasBaturIntent) {
    missing.push({
      field: 'transport',
      priority: 'low',
      question: 'Нужен трансфер из отеля или вы планируете добраться самостоятельно?',
      reason: 'Трансфер может определять подходящий вариант и стоимость.',
    });
  }

  return missing
    .sort((a, b) => priorityWeight(b.priority) - priorityWeight(a.priority))
    .slice(0, MAX_QUESTIONS);
}

function priorityWeight(priority: MissingInformation['priority']): number {
  if (priority === 'high') {
    return 3;
  }

  if (priority === 'medium') {
    return 2;
  }

  return 1;
}
