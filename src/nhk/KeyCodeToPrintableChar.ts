export function keyCodeToPrintableChar(keyNumber: number, isShiftOn: boolean): string {
    // 47 keys
    type Key2PrintMap = {
        [key: number]: {
            shiftOn: string;
            shiftOff: string;
        };
    };

    let key2PrintMap: Key2PrintMap = {
        48: {
            shiftOn: ')',
            shiftOff: '0'
        },
        49: {
            shiftOn: '!',
            shiftOff: '1'
        },
        50: {
            shiftOn: '@',
            shiftOff: '2'
        },
        51: {
            shiftOn: '#',
            shiftOff: '3'
        },
        52: {
            shiftOn: '$',
            shiftOff: '4'
        },
        53: {
            shiftOn: '%',
            shiftOff: '5'
        },
        54: {
            shiftOn: '^',
            shiftOff: '6'
        },
        55: {
            shiftOn: '&',
            shiftOff: '7'
        },
        56: {
            shiftOn: '*',
            shiftOff: '8'
        },
        57: {
            shiftOn: '(',
            shiftOff: '9'
        },
        65: {
            shiftOn: 'A',
            shiftOff: 'a'
        },
        66: {
            shiftOn: 'B',
            shiftOff: 'b'
        },
        67: {
            shiftOn: 'C',
            shiftOff: 'c'
        },
        68: {
            shiftOn: 'D',
            shiftOff: 'd'
        },
        69: {
            shiftOn: 'E',
            shiftOff: 'e'
        },
        70: {
            shiftOn: 'F',
            shiftOff: 'f'
        },
        71: {
            shiftOn: 'G',
            shiftOff: 'g'
        },
        72: {
            shiftOn: 'H',
            shiftOff: 'h'
        },
        73: {
            shiftOn: 'I',
            shiftOff: 'i'
        },
        74: {
            shiftOn: 'J',
            shiftOff: 'j'
        },
        75: {
            shiftOn: 'K',
            shiftOff: 'k'
        },
        76: {
            shiftOn: 'L',
            shiftOff: 'l'
        },
        77: {
            shiftOn: 'M',
            shiftOff: 'm'
        },
        78: {
            shiftOn: 'N',
            shiftOff: 'n'
        },
        79: {
            shiftOn: 'O',
            shiftOff: 'o'
        },
        80: {
            shiftOn: 'P',
            shiftOff: 'p'
        },
        81: {
            shiftOn: 'Q',
            shiftOff: 'q'
        },
        82: {
            shiftOn: 'R',
            shiftOff: 'r'
        },
        83: {
            shiftOn: 'S',
            shiftOff: 's'
        },
        84: {
            shiftOn: 'T',
            shiftOff: 't'
        },
        85: {
            shiftOn: 'U',
            shiftOff: 'u'
        },
        86: {
            shiftOn: 'V',
            shiftOff: 'v'
        },
        87: {
            shiftOn: 'W',
            shiftOff: 'w'
        },
        88: {
            shiftOn: 'X',
            shiftOff: 'x'
        },
        89: {
            shiftOn: 'Y',
            shiftOff: 'y'
        },
        90: {
            shiftOn: 'Z',
            shiftOff: 'z'
        },
        186: {
            shiftOn: ':',
            shiftOff: ';'
        },
        187: {
            shiftOn: '+',
            shiftOff: '='
        },
        188: {
            shiftOn: '<',
            shiftOff: ','
        },
        189: {
            shiftOn: '_',
            shiftOff: '-'
        },
        190: {
            shiftOn: '>',
            shiftOff: '.'
        },
        191: {
            shiftOn: '?',
            shiftOff: '/'
        },
        192: {
            shiftOn: '~',
            shiftOff: '`'
        },
        219: {
            shiftOn: '{',
            shiftOff: '['
        },
        220: {
            shiftOn: '|',
            shiftOff: '\\'
        },
        221: {
            shiftOn: '}',
            shiftOff: ']'
        },
        222: {
            shiftOn: '\'',
            shiftOff: '\''
        }
    };
    let keyMap = key2PrintMap[keyNumber];
    if (keyMap) {
        return isShiftOn ? keyMap.shiftOn : keyMap.shiftOff;
    } else {
        return '';
    }
}
