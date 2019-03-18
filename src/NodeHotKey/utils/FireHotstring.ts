import { keyCodeToPrintableChar } from './KeyCodeToPrintableChar';
import { click } from './KeyboardMouse';
import { KEYCODES } from './Keycodes';
import { MacroStepType } from '../NodeHotKey';
import { runMacro } from './RunMacro';

export function getUpdatedHotstring(keyPressedCode: string, isShiftOn: boolean, currHotString: string): string {
	let keyPressedCodeNumber = Number(keyPressedCode);
	let char: string = keyCodeToPrintableChar(keyPressedCodeNumber, isShiftOn);
	// shift key is exception for hotstring capture
	if (char === '' && keyPressedCodeNumber !== 16 && keyPressedCodeNumber !== 160 && keyPressedCodeNumber !== 161) {
		currHotString = '';
	} else {
		currHotString += char;
	}
	return currHotString;
}

export function fireHotstring(hot: string, steps: MacroStepType[]): void {
	if ((steps[0].hasOwnProperty('type') && steps[0].type !== undefined) || (steps[0].hasOwnProperty('paste') && steps[0].paste !== undefined))
		for (let i = 0; i < hot.length; i++) {
			click(KEYCODES._BACKSPACE);
		}
	runMacro(steps);
}