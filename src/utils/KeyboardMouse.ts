import robot from 'robot-js';
import { ClickType } from '../../types/nhk-types';
import { getClipboardText, setClipboardText } from './Clipboard';
import { KEYCODES as KC } from './Keycodes';
import { wait } from './Wait';

const keyboard = robot.Keyboard();
keyboard.autoDelay.min = 0;
keyboard.autoDelay.max = 0;

const mouse = robot.Mouse();
mouse.autoDelay.min = 0;
mouse.autoDelay.max = 0;

/**
 * press a keyboard/mouse key
 * @param keyCode {number} code of the key to press
 * @returns {void}
 */
export function pressKey(keyCode: number): void {
  keyCode < 8 ? mouse.press(keyCode) : keyboard.press(keyCode);
}
/**
 * release a keyboard/mouse key
 * @param keyCode {number} code of the key to release
 * @returns {void}
 */
export function releaseKey(keyCode: number): void {
  keyCode < 8 ? mouse.release(keyCode) : keyboard.release(keyCode);
}
/**
 * click a keyboard/mouse key
 * @param clickKey {ClickType}
 * @returns {void}
 */
export function click(clickKey: ClickType | number | number[]): void {
  const pressReleaseKeys = (keyCodes: number | number[]): void => {
    // convert keyCodes into an array if its a number
    keyCodes = typeof keyCodes === 'number' ? [keyCodes] : keyCodes;

    keyCodes.forEach((modifier) => {
      pressKey(modifier);
      releaseKey(modifier);
    });
  };

  if (typeof clickKey === 'number' || Array.isArray(clickKey)) {
    pressReleaseKeys(clickKey);
  } else if (typeof clickKey === 'object') {
    for (let i = 0; i < (clickKey.times || 1); i++) {
      if (clickKey.modifiers) {
        // convert modifiers into an array if its a number
        const modifiers = typeof clickKey.modifiers === 'number' ? [clickKey.modifiers] : clickKey.modifiers;

        modifiers.forEach((modifier) => pressKey(modifier));
        pressReleaseKeys(clickKey.key);
        modifiers.forEach((modifier) => releaseKey(modifier));
      } else {
        pressReleaseKeys(clickKey.key);
      }
    }
  }
}

/**
 * pastes given text
 * @param string {text} text to be pasted
 * @returns {void}
 */
export function paste(text: string): void {
  const tempClipText = getClipboardText();
  const delay = 200;

  setClipboardText(text);
  wait(delay);
  click({ key: KC._V, modifiers: [KC._CONTROL] });
  wait(delay);
  setClipboardText(tempClipText);
}
/**
 * type string using keystrokes
 * @param text {string} string to be typed
 * @returns {void}
 */
export function type(text: string): void {
  const getMapping = (c: string): string => {
    switch (c) {
      case ' ':
        return ' ';
      case '!':
        return '+1';
      case '"':
        return '+\'';
      case '#':
        return '+3';
      case '$':
        return '+4';
      case '%':
        return '+5';
      case '&':
        return '+7';
      case '\'':
        return '\'';
      case '(':
        return '+9';
      case ')':
        return '+0';
      case '*':
        return '+8';
      case '+':
        return '+=';
      case ',':
        return ',';
      case '-':
        return '-';
      case '.':
        return '.';
      case '/':
        return '/';
      case '0':
        return '0';
      case '1':
        return '1';
      case '2':
        return '2';
      case '3':
        return '3';
      case '4':
        return '4';
      case '5':
        return '5';
      case '6':
        return '6';
      case '7':
        return '7';
      case '8':
        return '8';
      case '9':
        return '9';
      case ':':
        return '+;';
      case ';':
        return ';';
      case '<':
        return '+,';
      case '=':
        return '=';
      case '>':
        return '+.';
      case '?':
        return '=/';
      case '@':
        return '+2';
      case 'A':
        return '+a';
      case 'B':
        return '+b';
      case 'C':
        return '+c';
      case 'D':
        return '+d';
      case 'E':
        return '+e';
      case 'F':
        return '+f';
      case 'G':
        return '+g';
      case 'H':
        return '+h';
      case 'I':
        return '+i';
      case 'J':
        return '+j';
      case 'K':
        return '+k';
      case 'L':
        return '+l';
      case 'M':
        return '+m';
      case 'N':
        return '+n';
      case 'O':
        return '+o';
      case 'P':
        return '+p';
      case 'Q':
        return '+q';
      case 'R':
        return '+r';
      case 'S':
        return '+s';
      case 'T':
        return '+t';
      case 'U':
        return '+u';
      case 'V':
        return '+v';
      case 'W':
        return '+w';
      case 'X':
        return '+x';
      case 'Y':
        return '+y';
      case 'Z':
        return '+z';
      case '[':
        return '[';
      case '\\':
        return '\\';
      case ']':
        return ']';
      case '^':
        return '+6';
      case '_':
        return '+-';
      case '`':
        return '`';
      case 'a':
        return 'a';
      case 'b':
        return 'b';
      case 'c':
        return 'c';
      case 'd':
        return 'd';
      case 'e':
        return 'e';
      case 'f':
        return 'f';
      case 'g':
        return 'g';
      case 'h':
        return 'h';
      case 'i':
        return 'i';
      case 'j':
        return 'j';
      case 'k':
        return 'k';
      case 'l':
        return 'l';
      case 'm':
        return 'm';
      case 'n':
        return 'n';
      case 'o':
        return 'o';
      case 'p':
        return 'p';
      case 'q':
        return 'q';
      case 'r':
        return 'r';
      case 's':
        return 's';
      case 't':
        return 't';
      case 'u':
        return 'u';
      case 'v':
        return 'v';
      case 'w':
        return 'w';
      case 'x':
        return 'x';
      case 'y':
        return 'y';
      case 'z':
        return 'z';
      case '{':
        return '+[';
      case '|':
        return '+\\';
      case '}':
        return '+]';
      case '~':
        return '+`';
      case '\n':
        return '{Enter}';
      case '':
        return ' ';
      default:
        return '';
    }
  };

  keyboard.click(
    text
      .split('')
      .map((c) => getMapping(c))
      .join(''),
  );
}
