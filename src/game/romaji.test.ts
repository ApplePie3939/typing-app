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
    const nApos = createRomajiMatcher('んあ');
    expect(nApos.feed('n')).toBe('ok');
    expect(nApos.feed("'")).toBe('ok');
    expect(nApos.feed('a')).toBe('complete');
  });

  it('accepts n then k for んか', () => {
    const matcher = createRomajiMatcher('んか');
    expect(matcher.feed('n')).toBe('ok');
    expect(matcher.feed('k')).toBe('ok');
    expect(matcher.feed('a')).toBe('complete');
  });

  it('completes あんない as annai', () => {
    const matcher = createRomajiMatcher('あんない');
    expect(
      Array.from('annai')
        .map((k) => matcher.feed(k))
        .at(-1),
    ).toBe('complete');
  });

  it('completes たいけんの as taikenno', () => {
    const matcher = createRomajiMatcher('たいけんの');
    expect(
      Array.from('taikenno')
        .map((k) => matcher.feed(k))
        .at(-1),
    ).toBe('complete');
  });

  it('completes ほんやく as honyaku', () => {
    const matcher = createRomajiMatcher('ほんやく');
    expect(
      Array.from('honyaku')
        .map((k) => matcher.feed(k))
        .at(-1),
    ).toBe('complete');
  });

  it('completes んな as nnna', () => {
    const matcher = createRomajiMatcher('んな');
    expect(
      Array.from('nnna')
        .map((k) => matcher.feed(k))
        .at(-1),
    ).toBe('complete');
  });

  it('hints the second n after the first n of ん', () => {
    const matcher = createRomajiMatcher('あんない');
    expect(matcher.feed('a')).toBe('ok');
    expect(matcher.feed('n')).toBe('ok');
    expect(matcher.hint().current).toBe('n');
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

  it('advances from b03 period with a, not s', () => {
    const prefix = 'roguinngamennmadeowarimasita.';
    const afterA = createRomajiMatcher('ろぐいんがめんまでおわりました。あした');
    for (const key of Array.from(prefix)) {
      expect(afterA.feed(key)).not.toBe('miss');
    }
    const indexAfterPeriod = afterA.tokenIndex;
    expect(afterA.feed('a')).toBe('ok');
    expect(afterA.tokenIndex).toBe(indexAfterPeriod + 1);

    const afterS = createRomajiMatcher('ろぐいんがめんまでおわりました。あした');
    for (const key of Array.from(prefix)) {
      expect(afterS.feed(key)).not.toBe('miss');
    }
    expect(afterS.feed('s')).toBe('miss');
    expect(afterS.tokenIndex).toBe(indexAfterPeriod);
  });

  it('completes あした as asita and ashita', () => {
    const asita = createRomajiMatcher('あした');
    expect(
      Array.from('asita')
        .map((k) => asita.feed(k))
        .at(-1),
    ).toBe('complete');
    const ashita = createRomajiMatcher('あした');
    expect(
      Array.from('ashita')
        .map((k) => ashita.feed(k))
        .at(-1),
    ).toBe('complete');
  });

  it('completes でー as dee and de-', () => {
    const dee = createRomajiMatcher('でー');
    expect(
      Array.from('dee')
        .map((k) => dee.feed(k))
        .at(-1),
    ).toBe('complete');
    const deHyphen = createRomajiMatcher('でー');
    expect(
      Array.from('de-')
        .map((k) => deHyphen.feed(k))
        .at(-1),
    ).toBe('complete');
  });
});
