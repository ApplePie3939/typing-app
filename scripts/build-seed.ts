import { mkdirSync, writeFileSync } from 'node:fs';
import { PROMPTS } from '../src/game/prompts.ts';

function sqlString(value: string): string {
  return `'${value.replaceAll("'", "''")}'`;
}

const rows = PROMPTS.map((p) => {
  const units = JSON.stringify(p.units).replaceAll("'", "''");
  return `(${sqlString(p.id)}, ${sqlString(p.difficulty)}, ${sqlString(p.senderName)}, ${sqlString(p.senderRole)}, ${sqlString(p.channel)}, ${sqlString(p.incomingMessage)}, ${sqlString(p.replyText)}, ${sqlString(p.replyReading)}, '${units}')`;
});

const sql = `DELETE FROM prompts;
INSERT INTO prompts (id, difficulty, sender_name, sender_role, channel, incoming_message, reply_text, reply_reading, reply_units)
VALUES
${rows.join(',\n')};
`;

mkdirSync('seed', { recursive: true });
writeFileSync('seed/prompts.sql', sql);
console.log(`wrote seed/prompts.sql (${PROMPTS.length} prompts)`);
