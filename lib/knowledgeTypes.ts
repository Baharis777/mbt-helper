export interface KnowledgeSearchInput {
  message: string;
  limit?: number;
}

export interface KnowledgeSearchResult {
  filePath: string;
  score: number;
  matchedKeywords: string[];
  content: string;
}

export type KeywordGroupName =
  | 'batur'
  | 'eruption_safety'
  | 'sunrise_trekking'
  | 'jeep_or_no_hike'
  | 'hot_springs'
  | 'transfer'
  | 'price'
  | 'booking'
  | 'children_health';

export interface KeywordGroup {
  name: KeywordGroupName;
  keywords: string[];
}

export interface KnowledgeDocument {
  filePath: string;
  absolutePath: string;
  content: string;
}
