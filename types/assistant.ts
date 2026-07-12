export type TourCategory = 'mount_batur';

export type KnowledgeStatus = 'draft' | 'active' | 'archived';

export type ContentLanguage = 'ru' | 'en';

export type KnowledgeItemType =
  | 'tour_family'
  | 'tour_variant'
  | 'policy'
  | 'live_status';

export type SourceStatus = 'needs_import' | 'needs_review';

export type TourKnowledgeKind = 'family' | 'variant';

export interface TourKnowledge {
  id: string;
  kind: TourKnowledgeKind;
  parentId?: string;
  title: string;
  category: TourCategory;
  status: KnowledgeStatus;
  contentLanguage: ContentLanguage;
  lastReviewed?: string;
  owner?: string;
  summary: string;
  bestFor: string[];
  highlights: string[];
  itinerary: TourItineraryItem[];
  inclusions: string[];
  exclusions: string[];
  pickup: PickupGuidance;
  duration: string;
  difficultyAndAccessibility: string;
  whatCustomersShouldBring: string[];
  policyRefs: string[];
  salesNotes: SalesNotes;
  managerNotes?: string;
}

export interface KnowledgeSource {
  itemId: string;
  itemType: KnowledgeItemType;
  parentId?: string;
  sourceUrl: string;
  sourceType: string;
  status: SourceStatus;
  notes?: string;
}

export interface TourItineraryItem {
  order: number;
  title: string;
  description: string;
}

export interface PickupGuidance {
  areas: string[];
  window?: string;
  meetingPointNotes?: string;
}

export interface SalesNotes {
  mainSellingPoints: string[];
  commonObjections: string[];
  suggestedAlternatives: string[];
  upsellOpportunities: string[];
}

export interface AssistantResponseDraft {
  audience: 'manager' | 'sales_team' | 'customer_draft';
  language: ContentLanguage;
  answer: string;
  knowledgeRefs: string[];
  needsConfirmation: boolean;
  confirmationNotes?: string[];
}

export type ClientLanguage = ContentLanguage | 'id' | 'unknown';

export type ClientIntentType =
  | 'mount_batur'
  | 'sunrise_trekking'
  | 'hot_springs'
  | 'no_hike_or_jeep'
  | 'price'
  | 'booking'
  | 'availability'
  | 'safety'
  | 'transfer'
  | 'recommendation';

export interface ClientIntent {
  type: ClientIntentType;
  confidence: number;
  matchedPhrases: string[];
}

export type PreferenceValue = true | false | null;

export type TourFormatPreference = 'group' | 'private' | 'trekking' | 'no_hike' | null;

export type BudgetPreference = 'lowest_price' | 'budget_sensitive' | 'unknown' | null;

export interface ClientProfile {
  language: ClientLanguage;
  intents: ClientIntent[];
  travelDate: string | null;
  guestCount: number | null;
  adults: number | null;
  children: number | null;
  childAges: number[];
  hotelArea: string | null;
  ownTransport: PreferenceValue;
  needsTransfer: PreferenceValue;
  wantsHotSprings: PreferenceValue;
  formatPreference: TourFormatPreference;
  budget: BudgetPreference;
  healthOrFitnessLimitations: string[];
  otherConstraints: string[];
}

export type ClientConstraintType =
  | 'travel_date'
  | 'hotel_area'
  | 'guest_count'
  | 'children'
  | 'health'
  | 'transport'
  | 'budget'
  | 'format'
  | 'safety'
  | 'availability';

export interface ClientConstraint {
  type: ClientConstraintType;
  value: string;
  severity: 'info' | 'warning' | 'blocking';
  reason: string;
}

export interface MissingInformation {
  field:
    | 'travel_date'
    | 'hotel_area'
    | 'guest_count'
    | 'child_age'
    | 'health_details'
    | 'transport'
    | 'preferred_format'
    | 'budget';
  priority: 'high' | 'medium' | 'low';
  question: string;
  reason: string;
}

export interface BaturVariantData {
  variantId: string;
  sourceUrl: string;
  exactSiteName: string;
  format: string;
  transferIncluded: string;
  hotSpringsIncluded: string;
  privateOrGroup: string;
  pickupAreaRules: string;
  duration: string;
  price: string;
  included: string;
  notIncluded: string;
  cancellationRules: string;
  bestFor: string;
  notGoodFor: string;
  recommendedFor: string;
  notRecommendedFor: string;
  decisionSummary: string;
  managerPriority: string;
  managerNotes: string;
  status: string;
}

export interface VariantRecommendation {
  variantId: string;
  sourceUrl: string;
  score: number;
  rank: number;
  status: 'suitable' | 'candidate_needs_review' | 'unsuitable';
  requiresReview: boolean;
  matchedReasons: string[];
  missingFacts: string[];
  internalWarnings: string[];
}

export type SuggestedNextActionType =
  | 'ask_clarification'
  | 'check_availability'
  | 'check_live_status'
  | 'recommend_variant'
  | 'send_payment_link'
  | 'manual_review';

export interface SuggestedNextAction {
  type: SuggestedNextActionType;
  reason: string;
  questions: string[];
}

export interface ManagerAnalysis {
  clientLanguage: ClientLanguage;
  intents: ClientIntent[];
  profile: ClientProfile;
  constraints: ClientConstraint[];
  missingInformation: MissingInformation[];
  internalWarnings: string[];
  suitableVariants: VariantRecommendation[];
  unsuitableVariants: VariantRecommendation[];
  nextBestAction: SuggestedNextAction;
  knowledgeRefs: string[];
  notes: string[];
}
