import { MacroStepType } from '../NodeHotKey';
import { pressKey, releaseKey, clickKey, type } from './KeyboardMouse';
import { setClipboardText, getClipboardText } from './Clipboard';
import { KEYCODES } from './Keycodes';
import { wait } from './Wait';

export function runMacro(steps: MacroStepType[]) {

	steps.forEach((step) => {
		if (step.pressKey) {
			let keyCode = step.pressKey;
			pressKey(keyCode);
		}
		
		if (step.releaseKey) {
			let keyCode = step.releaseKey;
			releaseKey(keyCode);
		}

		if (step.type) {
			let s = step.type;
			type(s);
		}

		if (step.click) {
			let click = step.click;
			if(typeof click === 'number') {
				clickKey(click);
			} else if( typeof click === 'object') {
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

		if (step.wait) {
			let delay = step.wait;
			wait(delay);
		}

		if (step.paste) {
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
	});
}