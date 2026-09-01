export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type PromptUnit = {
  display: string;
  reading: string;
};

export type TypingPrompt = {
  id: string;
  difficulty: Difficulty;
  senderName: string;
  senderRole: string;
  channel: string;
  incomingMessage: string;
  replyText: string;
  replyReading: string;
  units: PromptUnit[];
};

export type KeyCounts = {
  hits: number;
  misses: number;
};

export type PlayPayload = {
  playerId: string;
  difficulty: Difficulty;
  income: number;
  keysPerMinute: number;
  accuracy: number;
  missCount: number;
  maxCombo: number;
  messagesSent: number;
  durationMs: number;
  keyStats: Record<string, KeyCounts>;
  fingerStats: Record<string, KeyCounts>;
  bigramStats: Record<string, KeyCounts>;
};

export type WeakRow = {
  label: string;
  hits: number;
  misses: number;
  missRate: number;
  reference?: boolean;
};
