import type { ClientProfile, MissingInformation, SuggestedNextAction, VariantRecommendation } from '../types/assistant.js';

export function getNextBestAction(
  profile: ClientProfile,
  missingInformation: MissingInformation[],
  variantRecommendations: VariantRecommendation[],
): SuggestedNextAction {
  const intentTypes = new Set(profile.intents.map((intent) => intent.type));
  const questions = missingInformation.map((item) => item.question);

  if (intentTypes.has('safety')) {
    return {
      type: 'check_live_status',
      reason: 'Клиент спрашивает про текущую безопасность, активность вулкана или статус маршрута.',
      questions: [],
    };
  }

  if (profile.healthOrFitnessLimitations.length > 0 || profile.children !== null || profile.childAges.length > 0) {
    return {
      type: missingInformation.length > 0 ? 'ask_clarification' : 'manual_review',
      reason: 'Есть дети или ограничения по здоровью: перед рекомендацией нужна ручная проверка допустимости и нагрузки.',
      questions,
    };
  }

  if (missingInformation.length > 0) {
    return {
      type: 'ask_clarification',
      reason: 'Не хватает данных, которые влияют на подбор варианта или проверку доступности.',
      questions,
    };
  }

  if (intentTypes.has('availability') || intentTypes.has('booking')) {
    return {
      type: 'check_availability',
      reason: 'Клиент спрашивает про доступность или бронирование.',
      questions: [],
    };
  }

  const confirmedSuitable = variantRecommendations.filter((variant) => variant.status === 'suitable');

  if (confirmedSuitable.length > 0) {
    return {
      type: 'recommend_variant',
      reason: 'Данных достаточно, и есть вариант с подтвержденными ключевыми свойствами.',
      questions: [],
    };
  }

  if (variantRecommendations.some((variant) => variant.requiresReview)) {
    return {
      type: 'manual_review',
      reason: 'Потребности клиента распознаны, но свойства вариантов еще требуют проверки в матрице или у организатора.',
      questions: [],
    };
  }

  return {
    type: 'recommend_variant',
    reason: 'Достаточно данных для предварительной рекомендации.',
    questions: [],
  };
}
