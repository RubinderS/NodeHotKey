import { MacroStepType } from '../../types/nhk-types';
import { getClipboardText, setClipboardText } from '../utils/Clipboard';
import { click, paste, pressKey, releaseKey, type } from '../utils/KeyboardMouse';
import { wait } from '../utils/Wait';
import { matchCurrentWindowTitle } from '../utils/Window';

export function runMacro(steps: MacroStepType[]) {

  steps.forEach((step) => {
    if (step.pressKey !== undefined) {
      const keyCode = step.pressKey;
      pressKey(keyCode);
    }

    if (step.releaseKey !== undefined) {
      const keyCode = step.releaseKey;
      releaseKey(keyCode);
    }

    if (step.type !== undefined) {
      const s = step.type;
      type(s);
    }

    if (step.click !== undefined) {
      click(step.click);
    }

    if (step.wait !== undefined) {
      const delay = step.wait;
      wait(delay);
    }

    if (step.paste !== undefined) {
      const text = step.paste;
      paste(text);
    }

    if (step.func !== undefined) {
      step.func({ pressKey, releaseKey, click, type, paste, wait, setClipboardText, getClipboardText, matchCurrentWindowTitle });
    }

  });
}
