export type ContentStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'DISCARDED';

export interface DailyItem {
  id: string;
  label: string;
  emoji: string;
  category: string;
}

export interface GeneratedContentPayload {
  date: string; // YYYY-MM-DD
  theme: string;
  items: DailyItem[];
  generatedAt: string;
}

export interface AutoEvaluationResult {
  approved: boolean;
  reason: string;
  evaluatedAt: string;
  criteriaScores?: {
    distinctiveness: boolean;
    familiarity: boolean;
    nonThreatening: boolean;
    noBrandOrPolitics: boolean;
    simpleLanguage: boolean;
  };
}

export interface DailyContentCandidate {
  id: string;
  date: string;
  payload: GeneratedContentPayload;
  evaluation: AutoEvaluationResult;
  status: ContentStatus;
  retryCount: number;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  isFallback?: boolean;
}

export interface DailyHistoryRecord {
  id: string;
  date: string;
  theme: string;
  itemsSummary: string[];
  approvedBy: string;
  approvedAt: string;
  status: 'APPROVED' | 'FALLBACK';
}
