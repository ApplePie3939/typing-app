import type { KeyCounts, WeakRow } from './types.ts';

const MIN_HITS = 20;

export function emptyCounts(): KeyCounts {
  return { hits: 0, misses: 0 };
}

export function addCounts(
  target: Record<string, KeyCounts>,
  key: string,
  kind: 'hits' | 'misses',
): void {
  const row = target[key] ?? emptyCounts();
  row[kind] += 1;
  target[key] = row;
}

export function mergeCounts(...maps: Record<string, KeyCounts>[]): Record<string, KeyCounts> {
  const out: Record<string, KeyCounts> = {};
  for (const map of maps) {
    for (const [key, counts] of Object.entries(map)) {
      const row = out[key] ?? emptyCounts();
      row.hits += counts.hits;
      row.misses += counts.misses;
      out[key] = row;
    }
  }
  return out;
}

export function toWeakRows(map: Record<string, KeyCounts>, limit = 10): WeakRow[] {
  return Object.entries(map)
    .map(([label, counts]) => {
      const missRate = counts.hits === 0 ? 0 : counts.misses / counts.hits;
      return {
        label,
        hits: counts.hits,
        misses: counts.misses,
        missRate,
        reference: counts.hits < MIN_HITS,
      };
    })
    .sort((a, b) => {
      if (a.reference !== b.reference) return a.reference ? 1 : -1;
      if (b.missRate !== a.missRate) return b.missRate - a.missRate;
      return b.misses - a.misses;
    })
    .slice(0, limit);
}

export function hasEnoughData(maps: Record<string, KeyCounts>[]): boolean {
  return maps.some((map) => Object.values(map).some((c) => c.hits > 0));
}
