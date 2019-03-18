import { MacroStepType } from '../NodeHotKey';
import { pressKey, releaseKey, click, type, paste } from './KeyboardMouse';
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
			click(step.click);
		}

		if (step.hasOwnProperty('wait') && step.wait !== undefined) {
			let delay = step.wait;
			wait(delay);
		}

		if (step.hasOwnProperty('paste') && step.paste !== undefined) {
			let text = step.paste;
			paste(text);
		}

		if (step.hasOwnProperty('func') && step.func !== undefined) {
			step.func(pressKey, releaseKey, click, type, paste, wait, setClipboardText, getClipboardText);
		}

	});
}