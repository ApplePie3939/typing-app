export type Finger =
  | '左小指'
  | '左薬指'
  | '左中指'
  | '左人差指'
  | '右人差指'
  | '右中指'
  | '右薬指'
  | '右小指'
  | '親指'
  | 'その他';

const FINGER_BY_CODE: Record<string, Finger> = {
  Backquote: '左小指',
  Digit1: '左小指',
  KeyQ: '左小指',
  KeyA: '左小指',
  KeyZ: '左小指',
  Tab: '左小指',
  Digit2: '左薬指',
  KeyW: '左薬指',
  KeyS: '左薬指',
  KeyX: '左薬指',
  Digit3: '左中指',
  KeyE: '左中指',
  KeyD: '左中指',
  KeyC: '左中指',
  Digit4: '左人差指',
  Digit5: '左人差指',
  KeyR: '左人差指',
  KeyT: '左人差指',
  KeyF: '左人差指',
  KeyG: '左人差指',
  KeyV: '左人差指',
  KeyB: '左人差指',
  Digit6: '右人差指',
  Digit7: '右人差指',
  KeyY: '右人差指',
  KeyU: '右人差指',
  KeyH: '右人差指',
  KeyJ: '右人差指',
  KeyN: '右人差指',
  KeyM: '右人差指',
  Digit8: '右中指',
  KeyI: '右中指',
  KeyK: '右中指',
  Comma: '右中指',
  Digit9: '右薬指',
  KeyO: '右薬指',
  KeyL: '右薬指',
  Period: '右薬指',
  Digit0: '右小指',
  Minus: '右小指',
  Equal: '右小指',
  IntlYen: '右小指',
  KeyP: '右小指',
  BracketLeft: '右小指',
  BracketRight: '右小指',
  Backslash: '右小指',
  Semicolon: '右小指',
  Quote: '右小指',
  Slash: '右小指',
  IntlRo: '右小指',
  Enter: '右小指',
  Backspace: '右小指',
  Space: '親指',
};

const LABEL_BY_CODE: Record<string, string> = {
  Digit1: '1',
  Digit2: '2',
  Digit3: '3',
  Digit4: '4',
  Digit5: '5',
  Digit6: '6',
  Digit7: '7',
  Digit8: '8',
  Digit9: '9',
  Digit0: '0',
  KeyA: 'A',
  KeyB: 'B',
  KeyC: 'C',
  KeyD: 'D',
  KeyE: 'E',
  KeyF: 'F',
  KeyG: 'G',
  KeyH: 'H',
  KeyI: 'I',
  KeyJ: 'J',
  KeyK: 'K',
  KeyL: 'L',
  KeyM: 'M',
  KeyN: 'N',
  KeyO: 'O',
  KeyP: 'P',
  KeyQ: 'Q',
  KeyR: 'R',
  KeyS: 'S',
  KeyT: 'T',
  KeyU: 'U',
  KeyV: 'V',
  KeyW: 'W',
  KeyX: 'X',
  KeyY: 'Y',
  KeyZ: 'Z',
  Minus: '-',
  Equal: '^',
  BracketLeft: '@',
  BracketRight: '[',
  Backslash: ']',
  Semicolon: ';',
  Quote: ':',
  Comma: ',',
  Period: '.',
  Slash: '/',
  IntlRo: '\\',
  IntlYen: '¥',
  Space: 'Space',
  Enter: 'Enter',
  Backquote: '`',
};

export function physicalKeyFromCode(code: string): string {
  return LABEL_BY_CODE[code] ?? code;
}

export function fingerFromCode(code: string): Finger {
  return FINGER_BY_CODE[code] ?? 'その他';
}

export function typingCharFromEvent(event: KeyboardEvent): string | undefined {
  if (event.ctrlKey || event.metaKey || event.altKey) return undefined;
  if (
    event.key === 'Shift' ||
    event.key === 'Control' ||
    event.key === 'Alt' ||
    event.key === 'Meta'
  ) {
    return undefined;
  }
  if (event.key === 'Backspace' || event.key === 'Tab' || event.key === 'Escape') return undefined;
  if (event.code === 'Space' || event.key === ' ') return ' ';
  if (event.code === 'Enter' || event.key === 'Enter') return '\n';
  if (event.code.startsWith('Key') && event.code.length === 4) {
    return event.code.slice(3).toLowerCase();
  }
  if (event.isComposing || event.key === 'Process') return undefined;
  if (event.key.length === 1) return event.key;
  return undefined;
}
