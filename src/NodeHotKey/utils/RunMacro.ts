import { MacroStepType } from '../NodeHotKey';
import { pressKey, releaseKey, clickKey, type } from './KeyboardMouse';
import { setClipboardText, getClipboardText } from './Clipboard';
import { KEYCODES } from './Keycodes';
import { wait } from './Wait';

export function runMacro(steps: MacroStepType[]) {

	steps.forEach((step) => {
		if (step.hasOwnProperty('pressKey') && step.pressKey !== undefined) {
			let keyCode = step.pressKey;
			pressKey(keyCode);
		}

		if (step.hasOwnProperty('releaseKey') && step.releaseKey !== undefined) {
			let keyCode = step.releaseKey;
			releaseKey(keyCode);
		}

		if (step.hasOwnProperty('type') && step.type !== undefined) {
			let s = step.type;
			type(s);
		}

		if (step.hasOwnProperty('click') && step.click !== undefined) {
			let click = step.click;
			if (typeof click === 'number') {
				clickKey(click);
			} else if (typeof click === 'object') {
				for (let i = 0; i < (click.times || 1); i++) {
					if (click.modifiers) {
						click.modifiers.forEach(modifier => pressKey(modifier));
						clickKey(click.key);
						click.modifiers.forEach(modifier => releaseKey(modifier));
					} else {
						clickKey(click.key);
					}
				}
			}
		}

		if (step.hasOwnProperty('wait') && step.wait !== undefined) {
			let delay = step.wait;
			wait(delay);
		}

		if (step.hasOwnProperty('paste') && step.paste !== undefined) {
			let s = step.paste;
			let tempClipText = getClipboardText();
			let delay = 100;
			setClipboardText(s);
			wait(delay);
			pressKey(KEYCODES._CONTROL);
			wait(delay);
			clickKey(KEYCODES._V);
			wait(delay);
			releaseKey(KEYCODES._CONTROL);
			wait(delay);
			setClipboardText(tempClipText);
			wait(delay);
		}

		if (step.hasOwnProperty('func') && step.func !== undefined) {
			step.func(pressKey, releaseKey, clickKey, type, wait, setClipboardText, getClipboardText);
		}

	});
}