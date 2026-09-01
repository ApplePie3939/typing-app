-- Initial schema for prompts and play results
CREATE TABLE prompts (
  id TEXT PRIMARY KEY,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  sender_name TEXT NOT NULL,
  sender_role TEXT NOT NULL,
  channel TEXT NOT NULL,
  incoming_message TEXT NOT NULL,
  reply_text TEXT NOT NULL,
  reply_reading TEXT NOT NULL,
  reply_units TEXT NOT NULL
);

CREATE INDEX idx_prompts_difficulty ON prompts (difficulty);

CREATE TABLE plays (
  id TEXT PRIMARY KEY,
  player_id TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  income INTEGER NOT NULL,
  keys_per_minute REAL NOT NULL,
  accuracy REAL NOT NULL,
  miss_count INTEGER NOT NULL,
  max_combo INTEGER NOT NULL,
  messages_sent INTEGER NOT NULL,
  duration_ms INTEGER NOT NULL,
  key_stats TEXT NOT NULL,
  finger_stats TEXT NOT NULL,
  bigram_stats TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX idx_plays_player ON plays (player_id);
