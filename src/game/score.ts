import type { Difficulty } from './types.ts';

export const PLAY_SECONDS = 60;

export const BASE_INCOME: Record<Difficulty, number> = {
  beginner: 120_000,
  intermediate: 220_000,
  advanced: 350_000,
};

export const TARGET_KPM: Record<Difficulty, number> = {
  beginner: 200,
  intermediate: 280,
  advanced: 360,
};

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function accuracyRatio(correct: number, misses: number): number {
  const denom = correct + misses;
  if (denom === 0) return 1;
  return correct / denom;
}

export function speedMultiplier(
  correctKeys: number,
  elapsedMs: number,
  difficulty: Difficulty,
): number {
  const minutes = elapsedMs / 60_000;
  const kpm = minutes <= 0 ? 0 : correctKeys / minutes;
  return clamp(kpm / TARGET_KPM[difficulty], 0.5, 2);
}

export function accuracyMultiplier(correct: number, misses: number): number {
  return Math.max(0, (accuracyRatio(correct, misses) - 0.5) * 2);
}

export function roundYen(amount: number): number {
  return Math.round(amount / 100) * 100;
}

export function messageIncome(
  difficulty: Difficulty,
  correctKeys: number,
  misses: number,
  elapsedMs: number,
): number {
  if (correctKeys <= 0) return 0;
  const raw =
    BASE_INCOME[difficulty] *
    speedMultiplier(correctKeys, elapsedMs, difficulty) *
    accuracyMultiplier(correctKeys, misses);
  return roundYen(raw);
}

export function playKeysPerMinute(correctKeys: number, durationMs: number): number {
  const minutes = durationMs / 60_000;
  if (minutes <= 0) return 0;
  return correctKeys / minutes;
}

export function formatYen(amount: number): string {
  return `¥${amount.toLocaleString('ja-JP')}`;
}

export function formatAccuracyPercent(ratio: number): string {
  return `${(ratio * 100).toFixed(1)}%`;
}
