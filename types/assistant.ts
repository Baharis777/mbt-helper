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
