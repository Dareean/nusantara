export type QuestionType =
  | "learn"
  | "visual"
  | "audio"
  | "word_builder"
  | "matching"
  | "roleplay"
  | "hotspot"
  | "multiple_choice"
  | "true_false"
  | "match"
  | "order"
  | "scenario";

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

export interface MatchPairItem {
  left: string;
  right: string;
}

export interface ScenarioChoice {
  id?: string;
  label: string;
  score: number;
  feedback?: string;
}

export interface ScenarioStep {
  prompt: string;
  choices: ScenarioChoice[];
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
  audioUrl?: string;
  imageUrl?: string;
  imageCaption?: string;
  options?: QuestionOption[];
  hotspots?: HotspotItem[];
  // For match
  pairs?: MatchPairItem[];
  matchingPairs?: MatchingPair[]; // legacy
  // For order
  items?: string[];
  wordTiles?: string[]; // legacy
  targetSentence?: string[]; // legacy
  // For true_false
  statement?: string;
  answerBoolean?: boolean;
  // For scenario
  steps?: ScenarioStep[];
  passingScore?: number;
  scenarioContext?: string; // legacy
  npcDialogue?: string; // legacy
  curatorNote: string;
  why?: string;
  xp?: number;
}

export interface CulturalSourceCard {
  institution: string;
  informant: string;
  registrationCode: string;
  verifiedDate: string;
  summary: string;
  status?: string;
}

export interface GameSession {
  id: string;
  title: string;
  chapter: string;
  subEthnic: string;
  streakDays: number;
  xpReward: number;
  status?: "draft" | "published";
  culturalSourceCard?: CulturalSourceCard;
  questions: GameQuestion[];
}

