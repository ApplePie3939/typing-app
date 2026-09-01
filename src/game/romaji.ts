const DIGRAPHS = [
  'きゃ',
  'きゅ',
  'きょ',
  'ぎゃ',
  'ぎゅ',
  'ぎょ',
  'しゃ',
  'しゅ',
  'しょ',
  'じゃ',
  'じゅ',
  'じょ',
  'ちゃ',
  'ちゅ',
  'ちょ',
  'にゃ',
  'にゅ',
  'にょ',
  'ひゃ',
  'ひゅ',
  'ひょ',
  'びゃ',
  'びゅ',
  'びょ',
  'ぴゃ',
  'ぴゅ',
  'ぴょ',
  'みゃ',
  'みゅ',
  'みょ',
  'りゃ',
  'りゅ',
  'りょ',
  'ヴぁ',
  'ヴぃ',
  'ヴぅ',
  'ヴぇ',
  'ヴぉ',
  'ふぁ',
  'ふぃ',
  'ふぇ',
  'ふぉ',
  'てぃ',
  'でぃ',
  'とぅ',
  'どぅ',
  'しぇ',
  'じぇ',
  'ちぇ',
  'つぁ',
  'つぃ',
  'つぇ',
  'つぉ',
  'うぃ',
  'うぇ',
  'うぉ',
];

const ROMAJI: Record<string, string[]> = {
  あ: ['a'],
  い: ['i', 'yi'],
  う: ['u', 'wu', 'whu'],
  え: ['e'],
  お: ['o'],
  か: ['ka', 'ca'],
  き: ['ki'],
  く: ['ku', 'cu', 'qu'],
  け: ['ke'],
  こ: ['ko', 'co'],
  が: ['ga'],
  ぎ: ['gi'],
  ぐ: ['gu'],
  げ: ['ge'],
  ご: ['go'],
  さ: ['sa'],
  し: ['si', 'shi', 'ci'],
  す: ['su'],
  せ: ['se', 'ce'],
  そ: ['so'],
  ざ: ['za'],
  じ: ['zi', 'ji'],
  ず: ['zu'],
  ぜ: ['ze'],
  ぞ: ['zo'],
  た: ['ta'],
  ち: ['ti', 'chi'],
  つ: ['tu', 'tsu'],
  て: ['te'],
  と: ['to'],
  だ: ['da'],
  ぢ: ['di', 'dyi'],
  づ: ['du'],
  で: ['de'],
  ど: ['do'],
  な: ['na'],
  に: ['ni'],
  ぬ: ['nu'],
  ね: ['ne'],
  の: ['no'],
  は: ['ha'],
  ひ: ['hi'],
  ふ: ['hu', 'fu'],
  へ: ['he'],
  ほ: ['ho'],
  ば: ['ba'],
  び: ['bi'],
  ぶ: ['bu'],
  べ: ['be'],
  ぼ: ['bo'],
  ぱ: ['pa'],
  ぴ: ['pi'],
  ぷ: ['pu'],
  ぺ: ['pe'],
  ぽ: ['po'],
  ま: ['ma'],
  み: ['mi'],
  む: ['mu'],
  め: ['me'],
  も: ['mo'],
  や: ['ya'],
  ゆ: ['yu'],
  よ: ['yo'],
  ら: ['ra'],
  り: ['ri'],
  る: ['ru'],
  れ: ['re'],
  ろ: ['ro'],
  わ: ['wa'],
  を: ['wo', 'o'],
  ぁ: ['la', 'xa'],
  ぃ: ['li', 'xi', 'lyi', 'xyi'],
  ぅ: ['lu', 'xu'],
  ぇ: ['le', 'xe', 'lye', 'xye'],
  ぉ: ['lo', 'xo'],
  ゃ: ['lya', 'xya'],
  ゅ: ['lyu', 'xyu'],
  ょ: ['lyo', 'xyo'],
  っ: ['xtu', 'ltu', 'xtsu', 'ltsu'],
  きゃ: ['kya', 'kixa', 'kilya'],
  きゅ: ['kyu', 'kixu', 'kilyu'],
  きょ: ['kyo', 'kixo', 'kilyo'],
  ぎゃ: ['gya'],
  ぎゅ: ['gyu'],
  ぎょ: ['gyo'],
  しゃ: ['sya', 'sha'],
  しゅ: ['syu', 'shu'],
  しょ: ['syo', 'sho'],
  じゃ: ['zya', 'ja', 'jya'],
  じゅ: ['zyu', 'ju', 'jyu'],
  じょ: ['zyo', 'jo', 'jyo'],
  ちゃ: ['tya', 'cha', 'cya'],
  ちゅ: ['tyu', 'chu', 'cyu'],
  ちょ: ['tyo', 'cho', 'cyo'],
  にゃ: ['nya'],
  にゅ: ['nyu'],
  にょ: ['nyo'],
  ひゃ: ['hya'],
  ひゅ: ['hyu'],
  ひょ: ['hyo'],
  びゃ: ['bya'],
  びゅ: ['byu'],
  びょ: ['byo'],
  ぴゃ: ['pya'],
  ぴゅ: ['pyu'],
  ぴょ: ['pyo'],
  みゃ: ['mya'],
  みゅ: ['myu'],
  みょ: ['myo'],
  りゃ: ['rya'],
  りゅ: ['ryu'],
  りょ: ['ryo'],
  ふぁ: ['fa', 'huxa', 'fula'],
  ふぃ: ['fi', 'huxi', 'fuli'],
  ふぇ: ['fe', 'huxe', 'fule'],
  ふぉ: ['fo', 'huxo', 'fulo'],
  てぃ: ['thi', 'texi', 'teli'],
  でぃ: ['dhi', 'dexi', 'deli'],
  とぅ: ['twu', 'toxu', 'tolu'],
  どぅ: ['dwu', 'doxu', 'dolu'],
  しぇ: ['sye', 'she'],
  じぇ: ['zye', 'je'],
  ちぇ: ['tye', 'che'],
  つぁ: ['tsa', 'tuxa'],
  つぃ: ['tsi', 'tuxi'],
  つぇ: ['tse', 'tuxe'],
  つぉ: ['tso', 'tuxo'],
  うぃ: ['wi', 'uxi', 'uli'],
  うぇ: ['we', 'uxe', 'ule'],
  うぉ: ['who', 'uxo', 'ulo'],
  ヴ: ['vu'],
  ヴぁ: ['va'],
  ヴぃ: ['vi'],
  ヴぅ: ['vu'],
  ヴぇ: ['ve'],
  ヴぉ: ['vo'],
  '。': ['.'],
  '、': [','],
  '！': ['!'],
  '？': ['?'],
  ー: ['-'],
  '〜': ['-'],
  '・': ['/'],
  '　': [' '],
  '\n': ['\n'],
  '「': ['['],
  '」': [']'],
  '（': ['('],
  '）': [')'],
  '【': ['['],
  '】': [']'],
};

const VOWEL_START = /^[aiueo]/;

function nOptions(next: string | undefined): string[] {
  if (!next) return ['nn', "n'", 'n'];
  const opts = romajiOptions(next);
  const needsStrict = opts.some((o) => VOWEL_START.test(o));
  return needsStrict ? ['nn', "n'"] : ['n', 'nn', "n'"];
}

function firstConsonant(roma: string): string | undefined {
  const m = roma.match(/^([^aiueo])/);
  return m?.[1];
}

function sokuonOptions(next: string): string[] {
  const nextOpts = romajiOptions(next);
  const doubled = nextOpts.flatMap((o) => {
    const c = firstConsonant(o);
    return c ? [c + o] : [];
  });
  const xtu = ['xtu', 'ltu', 'xtsu', 'ltsu'].flatMap((s) => nextOpts.map((o) => s + o));
  return [...new Set([...doubled, ...xtu])];
}

export function romajiOptions(kana: string): string[] {
  if (ROMAJI[kana]) return ROMAJI[kana];
  return [kana];
}

export function tokenizeKana(input: string): string[] {
  const tokens: string[] = [];
  let i = 0;
  while (i < input.length) {
    if (input[i] === 'っ' && i + 1 < input.length) {
      const next = DIGRAPHS.find((d) => input.startsWith(d, i + 1)) ?? input[i + 1];
      tokens.push('っ' + next);
      i += 1 + next.length;
      continue;
    }
    const di = DIGRAPHS.find((d) => input.startsWith(d, i));
    if (di) {
      tokens.push(di);
      i += di.length;
      continue;
    }
    tokens.push(input[i]);
    i += 1;
  }
  return tokens;
}

function optionsForToken(token: string, next: string | undefined): string[] {
  if (token === 'ん') return nOptions(next);
  if (token.startsWith('っ') && token.length > 1) return sokuonOptions(token.slice(1));
  return romajiOptions(token);
}

function isSkippableSpace(token: string | undefined): boolean {
  return token === ' ' || token === '　';
}

export function visibleRomaji(text: string): string {
  return text.replaceAll(' ', '␣').replaceAll('\n', '↵');
}

export type RomajiResult = 'ok' | 'miss' | 'complete';

export function createRomajiMatcher(reading: string) {
  const tokens = tokenizeKana(reading);
  const options = tokens.map((token, i) => optionsForToken(token, tokens[i + 1]));
  let index = 0;
  let typed = '';
  let committed = '';

  const isExact = (opts: string[], value: string) => opts.includes(value);
  const canContinue = (opts: string[], value: string) =>
    opts.some((o) => o.startsWith(value) && o.length > value.length);
  const hasShorterExact = (opts: string[], value: string) =>
    opts.some((o) => o.length < value.length && value.startsWith(o));

  function snapshot() {
    return { index, typed, committed };
  }

  function restore(state: { index: number; typed: string; committed: string }) {
    index = state.index;
    typed = state.typed;
    committed = state.committed;
  }

  function feed(key: string): RomajiResult {
    if (index >= options.length) return 'complete';
    const opts = options[index];
    const nextTyped = typed + key;
    if (opts.some((o) => o.startsWith(nextTyped))) {
      typed = nextTyped;
      if (isExact(opts, typed) && !canContinue(opts, typed) && !hasShorterExact(opts, typed)) {
        committed += typed;
        index += 1;
        typed = '';
        return index >= options.length ? 'complete' : 'ok';
      }
      return 'ok';
    }
    const exactPrefixes = [
      ...new Set(opts.filter((o) => typed.startsWith(o) && o.length > 0)),
    ].sort((a, b) => b.length - a.length);
    for (const prefix of exactPrefixes) {
      const saved = snapshot();
      committed += prefix;
      index += 1;
      typed = typed.slice(prefix.length);
      const result = feed(key);
      if (result !== 'miss') return result;
      restore(saved);
    }
    if (!typed && isSkippableSpace(tokens[index]) && key !== ' ') {
      committed += tokens[index];
      index += 1;
      return feed(key);
    }
    return 'miss';
  }

  return {
    feed,
    get tokenIndex() {
      return index;
    },
    get tokenCount() {
      return tokens.length;
    },
    get tokens() {
      return tokens;
    },
    get progressKana() {
      return tokens.slice(0, index).join('').length;
    },
    get done() {
      return index >= options.length;
    },
    get committed() {
      return committed;
    },
    get currentTyped() {
      return typed;
    },
    hint(): { current: string; rest: string } {
      if (index >= options.length) return { current: '', rest: '' };
      const opts = options[index];
      const matching = opts.filter((o) => o.startsWith(typed));
      const extendable = matching.find((o) => o.length > typed.length);
      const best = extendable ?? matching[0] ?? opts[0];
      let remain = best.slice(typed.length);
      if (!remain && index + 1 < options.length) {
        remain = options[index + 1][0];
      }
      return { current: remain.slice(0, 1), rest: remain.slice(1) };
    },
  };
}

export function unitsCompleted(units: { reading: string }[], kanaCharsDone: number): number {
  let consumed = 0;
  let count = 0;
  for (const unit of units) {
    consumed += unit.reading.length;
    if (kanaCharsDone >= consumed) count += 1;
    else break;
  }
  return count;
}
