import { Hono } from 'hono';
import { mergeCounts, toWeakRows, hasEnoughData } from '../game/stats.ts';
import type { Difficulty, KeyCounts, PlayPayload } from '../game/types.ts';

type Bindings = { DB: D1Database };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DIFFICULTIES = new Set<Difficulty>(['beginner', 'intermediate', 'advanced']);

const app = new Hono<{ Bindings: Bindings }>();

app.get('/api/prompts', async (c) => {
  const difficulty = c.req.query('difficulty');
  if (!difficulty || !DIFFICULTIES.has(difficulty as Difficulty)) {
    return c.json({ error: 'invalid difficulty' }, 400);
  }
  const rows = await c.env.DB.prepare(
    `SELECT id, difficulty, sender_name, sender_role, channel, incoming_message, reply_text, reply_reading, reply_units
     FROM prompts WHERE difficulty = ?`,
  )
    .bind(difficulty)
    .all<{
      id: string;
      difficulty: Difficulty;
      sender_name: string;
      sender_role: string;
      channel: string;
      incoming_message: string;
      reply_text: string;
      reply_reading: string;
      reply_units: string;
    }>();

  return c.json({
    prompts: (rows.results ?? []).map((row) => ({
      id: row.id,
      difficulty: row.difficulty,
      senderName: row.sender_name,
      senderRole: row.sender_role,
      channel: row.channel,
      incomingMessage: row.incoming_message,
      replyText: row.reply_text,
      replyReading: row.reply_reading,
      units: JSON.parse(row.reply_units) as { display: string; reading: string }[],
    })),
  });
});

app.post('/api/plays', async (c) => {
  let body: PlayPayload;
  try {
    body = await c.req.json<PlayPayload>();
  } catch {
    return c.json({ error: 'invalid json' }, 400);
  }
  if (!UUID.test(body.playerId) || !DIFFICULTIES.has(body.difficulty)) {
    return c.json({ error: 'invalid payload' }, 400);
  }
  if (typeof body.income !== 'number' || body.income < 0 || body.income > 20_000_000) {
    return c.json({ error: 'invalid payload' }, 400);
  }
  const id = crypto.randomUUID();
  await c.env.DB.prepare(
    `INSERT INTO plays (
      id, player_id, difficulty, income, keys_per_minute, accuracy, miss_count, max_combo,
      messages_sent, duration_ms, key_stats, finger_stats, bigram_stats, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      id,
      body.playerId,
      body.difficulty,
      Math.round(body.income),
      Number(body.keysPerMinute) || 0,
      Number(body.accuracy) || 0,
      Math.max(0, Math.round(body.missCount) || 0),
      Math.max(0, Math.round(body.maxCombo) || 0),
      Math.max(0, Math.round(body.messagesSent) || 0),
      Math.max(0, Math.round(body.durationMs) || 0),
      JSON.stringify(body.keyStats ?? {}),
      JSON.stringify(body.fingerStats ?? {}),
      JSON.stringify(body.bigramStats ?? {}),
      Date.now(),
    )
    .run();
  return c.json({ ok: true, id });
});

app.get('/api/stats', async (c) => {
  const playerId = c.req.query('playerId');
  if (!playerId || !UUID.test(playerId)) {
    return c.json({ error: 'invalid playerId' }, 400);
  }
  const rows = await c.env.DB.prepare(
    `SELECT key_stats, finger_stats, bigram_stats FROM plays WHERE player_id = ?`,
  )
    .bind(playerId)
    .all<{ key_stats: string; finger_stats: string; bigram_stats: string }>();

  const keyMaps: Record<string, KeyCounts>[] = [];
  const fingerMaps: Record<string, KeyCounts>[] = [];
  const bigramMaps: Record<string, KeyCounts>[] = [];
  for (const row of rows.results ?? []) {
    keyMaps.push(JSON.parse(row.key_stats) as Record<string, KeyCounts>);
    fingerMaps.push(JSON.parse(row.finger_stats) as Record<string, KeyCounts>);
    bigramMaps.push(JSON.parse(row.bigram_stats) as Record<string, KeyCounts>);
  }
  const keys = mergeCounts(...keyMaps);
  const fingers = mergeCounts(...fingerMaps);
  const bigrams = mergeCounts(...bigramMaps);
  return c.json({
    empty: !hasEnoughData([keys, fingers, bigrams]),
    keys: toWeakRows(keys, 8),
    fingers: toWeakRows(fingers, 8),
    bigrams: toWeakRows(bigrams, 10),
    playCount: rows.results?.length ?? 0,
  });
});

export default app;
