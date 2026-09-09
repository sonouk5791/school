export type GameType = 'card-match' | 'sequence' | 'hangeul' | 'storybook' | 'video-gallery' | 'childhood';

export interface CardData {
  id: string;
  pairId: string;
  emoji: string;
  label: string;
  category: string;
  similarityGroup?: string;
}

export interface CardState extends CardData {
  isFlipped: boolean;
  isMatched: boolean;
}

export interface DifficultyConfig {
  level: number;
  pairCount: number;
  previewSeconds: number;
  similarityLevel: 'distinct' | 'medium' | 'similar';
}

// Sequence Game Types
export interface SequenceStep {
  stepNumber: number;
  label: string;
  emoji: string;
  description?: string;
}

export interface SequenceScenario {
  id: string;
  title: string;
  category: string;
  level: number;
  steps: SequenceStep[];
}

// Hangeul Game Types
export interface HangeulTile {
  id: string;
  char: string;
  correctIndex: number;
}

export interface HangeulScenario {
  id: string;
  questionTitle: string;
  hintText: string;
  fullWord: string;
  level: number;
  tiles: HangeulTile[];
}

// Storybook & Video Reminiscence Types
export interface StoryBookItem {
  id: string;
  title: string;
  category: string; // e.g., '고향 추억', '가족 이야기', '힐링 영상'
  coverEmoji: string;
  description: string;
  pages: {
    pageNumber: number;
    text: string;
    imageEmoji: string;
  }[];
  videoUrl?: string; // Embedded video url or simulation
}

export interface RoundLog {
  id: string;
  timestamp: string;
  rawTimestamp: number;
  gameType: GameType;
  roundNumber: number;
  difficultyLevel: number;
  isSuccess: boolean;
  reactionTimeMs: number;
  totalTimeMs: number;
  attemptCount: number;
  isSlowResponse: boolean;
  consecutiveSuccessCount: number;
  consecutiveFailureCount: number;
}

export interface EngineState {
  currentLevel: number;
  consecutiveSuccessCount: number;
  consecutiveFailureCount: number;
  recentReactionTimes: number[];
}
