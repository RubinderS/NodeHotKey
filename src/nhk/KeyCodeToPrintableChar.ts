export function keyCodeToPrintableChar(keyNumber: number, isShiftOn: boolean): string {
  // 47 keys
  interface IKey2PrintMap {
    [key: number]: {
      shiftOff: string;
      shiftOn: string;
    };
  }

  const key2PrintMap: IKey2PrintMap = {
    48: {
      shiftOff: '0',
      shiftOn: ')',
    },
    49: {
      shiftOff: '1',
      shiftOn: '!',
    },
    50: {
      shiftOff: '2',
      shiftOn: '@',
    },
    51: {
      shiftOff: '3',
      shiftOn: '#',
    },
    52: {
      shiftOff: '4',
      shiftOn: '$',
    },
    53: {
      shiftOff: '5',
      shiftOn: '%',
    },
    54: {
      shiftOff: '6',
      shiftOn: '^',
    },
    55: {
      shiftOff: '7',
      shiftOn: '&',
    },
    56: {
      shiftOff: '8',
      shiftOn: '*',
    },
    57: {
      shiftOff: '9',
      shiftOn: '(',
    },
    65: {
      shiftOff: 'a',
      shiftOn: 'A',
    },
    66: {
      shiftOff: 'b',
      shiftOn: 'B',
    },
    67: {
      shiftOff: 'c',
      shiftOn: 'C',
    },
    68: {
      shiftOff: 'd',
      shiftOn: 'D',
    },
    69: {
      shiftOff: 'e',
      shiftOn: 'E',
    },
    70: {
      shiftOff: 'f',
      shiftOn: 'F',
    },
    71: {
      shiftOff: 'g',
      shiftOn: 'G',
    },
    72: {
      shiftOff: 'h',
      shiftOn: 'H',
    },
    73: {
      shiftOff: 'i',
      shiftOn: 'I',
    },
    74: {
      shiftOff: 'j',
      shiftOn: 'J',
    },
    75: {
      shiftOff: 'k',
      shiftOn: 'K',
    },
    76: {
      shiftOff: 'l',
      shiftOn: 'L',
    },
    77: {
      shiftOff: 'm',
      shiftOn: 'M',
    },
    78: {
      shiftOff: 'n',
      shiftOn: 'N',
    },
    79: {
      shiftOff: 'o',
      shiftOn: 'O',
    },
    80: {
      shiftOff: 'p',
      shiftOn: 'P',
    },
    81: {
      shiftOff: 'q',
      shiftOn: 'Q',
    },
    82: {
      shiftOff: 'r',
      shiftOn: 'R',
    },
    83: {
      shiftOff: 's',
      shiftOn: 'S',
    },
    84: {
      shiftOff: 't',
      shiftOn: 'T',
    },
    85: {
      shiftOff: 'u',
      shiftOn: 'U',
    },
    86: {
      shiftOff: 'v',
      shiftOn: 'V',
    },
    87: {
      shiftOff: 'w',
      shiftOn: 'W',
    },
    88: {
      shiftOff: 'x',
      shiftOn: 'X',
    },
    89: {
      shiftOff: 'y',
      shiftOn: 'Y',
    },
    90: {
      shiftOff: 'z',
      shiftOn: 'Z',
    },
    186: {
      shiftOff: ';',
      shiftOn: ':',
    },
    187: {
      shiftOff: '=',
      shiftOn: '+',
    },
    188: {
      shiftOff: ',',
      shiftOn: '<',
    },
    189: {
      shiftOff: '-',
      shiftOn: '_',
    },
    190: {
      shiftOff: '.',
      shiftOn: '>',
    },
    191: {
      shiftOff: '/',
      shiftOn: '?',
    },
    192: {
      shiftOff: '`',
      shiftOn: '~',
    },
    219: {
      shiftOff: '[',
      shiftOn: '{',
    },
    220: {
      shiftOff: '\\',
      shiftOn: '|',
    },
    221: {
      shiftOff: ']',
      shiftOn: '}',
    },
    222: {
      shiftOff: '\'',
      shiftOn: '\'',
    },
  };

  const keyMap = key2PrintMap[keyNumber];

  if (keyMap) {
    return isShiftOn ? keyMap.shiftOn : keyMap.shiftOff;
  } else {
    return '';
  }
}
