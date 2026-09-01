import { describe, expect, it } from 'vite-plus/test';
import { createRomajiMatcher, tokenizeKana } from './romaji.ts';

describe('tokenizeKana', () => {
  it('keeps digraphs and sokuon with the next mora', () => {
    expect(tokenizeKana('しゃしん')).toEqual(['しゃ', 'し', 'ん']);
    expect(tokenizeKana('かった')).toEqual(['か', 'った']);
  });
});

describe('createRomajiMatcher', () => {
  it('accepts shi and si for し', () => {
    const shi = createRomajiMatcher('し');
    expect(
      Array.from('shi')
        .map((k) => shi.feed(k))
        .at(-1),
    ).toBe('complete');
    const si = createRomajiMatcher('し');
    expect(
      Array.from('si')
        .map((k) => si.feed(k))
        .at(-1),
    ).toBe('complete');
  });

  it('does not treat na as んあ', () => {
    const matcher = createRomajiMatcher('んあ');
    expect(matcher.feed('n')).toBe('ok');
    expect(matcher.feed('a')).toBe('miss');
    const nn = createRomajiMatcher('んあ');
    expect(nn.feed('n')).toBe('ok');
    expect(nn.feed('n')).toBe('ok');
    expect(nn.feed('a')).toBe('complete');
  });

  it('accepts n then k for んか', () => {
    const matcher = createRomajiMatcher('んか');
    expect(matcher.feed('n')).toBe('ok');
    expect(matcher.feed('k')).toBe('ok');
    expect(matcher.feed('a')).toBe('complete');
  });

  it('counts misses without advancing', () => {
    const matcher = createRomajiMatcher('あ');
    expect(matcher.feed('x')).toBe('miss');
    expect(matcher.tokenIndex).toBe(0);
    expect(matcher.feed('a')).toBe('complete');
  });

  it('skips a space after ascii so で can be typed without pressing space', () => {
    const matcher = createRomajiMatcher('`user` で');
    for (const key of Array.from('`user`')) {
      expect(matcher.feed(key)).toBe('ok');
    }
    expect(matcher.feed('d')).toBe('ok');
    expect(matcher.feed('e')).toBe('complete');
  });
});
