import { describe, expect, it } from 'vite-plus/test';
import { accuracyMultiplier, messageIncome, speedMultiplier } from './score.ts';

describe('score', () => {
  it('maps 100% accuracy to 1 and 90% to 0.8', () => {
    expect(accuracyMultiplier(10, 0)).toBe(1);
    expect(accuracyMultiplier(9, 1)).toBeCloseTo(0.8);
    expect(accuracyMultiplier(1, 1)).toBe(0);
  });

  it('clamps speed multiplier between 0.5 and 2', () => {
    expect(speedMultiplier(200, 60_000, 'beginner')).toBe(1);
    expect(speedMultiplier(20, 60_000, 'beginner')).toBe(0.5);
    expect(speedMultiplier(800, 60_000, 'beginner')).toBe(2);
  });

  it('pays nothing when accuracy is under 50%', () => {
    expect(messageIncome('beginner', 10, 12, 10_000)).toBe(0);
  });

  it('rounds to 100 yen', () => {
    const yen = messageIncome('beginner', 40, 0, 12_000);
    expect(yen).toBeGreaterThan(0);
    expect(yen % 100).toBe(0);
  });
});
