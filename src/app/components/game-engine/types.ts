export type QuestionType =
  | "learn"
  | "visual"
  | "audio"
  | "word_builder"
  | "matching"
  | "roleplay"
  | "hotspot"
  | "multiple_choice";

export interface QuestionOption {
  id: string;
  label?: string; // "A", "B", "C", "D"
  title: string;
  subtitle?: string;
  badge?: string;
  isCorrect: boolean;
}

export interface HotspotItem {
  id: number;
  name: string;
  title: string;
  description: string;
  tag?: string;
  top: string;
  left: string;
}

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface GameQuestion {
  id: string;
  type: QuestionType;
  title?: string;
  prompt: string;
  subPrompt?: string;
  badge?: string;
  category?: string;
  term?: string;
  ipa?: string;
  meaning?: string;
  speakerInfo?: string;
  audioDuration?: string;
  imageUrl?: string;
  imageCaption?: string;
  options?: QuestionOption[];
  hotspots?: HotspotItem[];
  // For Layar 4 (Word Builder)
  wordTiles?: string[];
  targetSentence?: string[];
  // For Layar 5 (Matching)
  matchingPairs?: MatchingPair[];
  // For Layar 6 (Connect / Roleplay)
  scenarioContext?: string;
  npcDialogue?: string;
  curatorNote: string;
}

export interface CulturalSourceCard {
  institution: string;
  informant: string;
  registrationCode: string;
  verifiedDate: string;
  summary: string;
}

export interface GameSession {
  id: string;
  title: string;
  chapter: string;
  subEthnic: string;
  streakDays: number;
  xpReward: number;
  culturalSourceCard?: CulturalSourceCard;
  questions: GameQuestion[];
}
