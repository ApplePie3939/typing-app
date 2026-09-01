import { describe, expect, it } from 'vite-plus/test';
import { mergeCounts, toWeakRows } from './stats.ts';
import { PROMPTS } from './prompts.ts';

describe('stats', () => {
  it('merges counts across plays', () => {
    const merged = mergeCounts(
      { A: { hits: 10, misses: 1 } },
      { A: { hits: 5, misses: 2 }, B: { hits: 3, misses: 0 } },
    );
    expect(merged.A).toEqual({ hits: 15, misses: 3 });
    expect(merged.B).toEqual({ hits: 3, misses: 0 });
  });

  it('ranks by miss rate and marks low-sample keys as reference', () => {
    const rows = toWeakRows({
      P: { hits: 40, misses: 10 },
      Y: { hits: 5, misses: 4 },
    });
    expect(rows[0].label).toBe('P');
    expect(rows[1]?.reference).toBe(true);
  });
});

describe('prompts', () => {
  it('has at least 15 prompts per difficulty', () => {
    const counts = { beginner: 0, intermediate: 0, advanced: 0 };
    for (const p of PROMPTS) counts[p.difficulty] += 1;
    expect(counts.beginner).toBeGreaterThanOrEqual(15);
    expect(counts.intermediate).toBeGreaterThanOrEqual(15);
    expect(counts.advanced).toBeGreaterThanOrEqual(15);
  });

  it('keeps reply text aligned with unit displays and readings', () => {
    for (const p of PROMPTS) {
      expect(p.units.map((u) => u.display).join('')).toBe(p.replyText);
      expect(p.units.map((u) => u.reading).join('')).toBe(p.replyReading);
      expect(p.incomingMessage.length).toBeGreaterThan(0);
      expect(p.replyReading.length).toBeGreaterThan(0);
    }
  });
});
