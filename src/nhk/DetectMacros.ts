import { ConditionsType, MacroType, KeyStateType, MacroStepType } from '../types';
import { matchCurrentWindowTitle, releaseKey, KEYCODES, click } from '../utils';
import { keyCodeToPrintableChar } from './KeyCodeToPrintableChar';
import { runMacro } from './RunMacro';


export function detectHotKeyEvents(macros: MacroType, keyboardStateCurr: KeyStateType, mouseStateCurr: KeyStateType): string | null {

    Object.keys(macros).forEach(key => {
        let macro = macros[key];
        if (
            macro.hotkeys &&
            areKeysPressed(macro.hotkeys, keyboardStateCurr, mouseStateCurr) &&
            matchMacroConditions(macro.conditions)
        ) {
            doubleKeyCodes.forEach(keyCode => releaseKey(keyCode));
            macro.hotkeys.forEach(keyCode => releaseKey(keyCode));
            emitEvent(eventTypes.hotKeyTriggered,
                {
                    macroName: key
                }, `${key}`);

            runMacro(macro.steps);
            return key;
        }
    });
    return null;
}

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

export function detectHotstringEvents(macros: MacroType, currHotstring: string): string | null {

    function fireHotstring(hot: string, steps: MacroStepType[]): void {
        if (steps[0].type !== undefined || steps[0].paste !== undefined)
            for (let i = 0; i < hot.length; i++) {
                click(KEYCODES._BACKSPACE);
            }
        runMacro(steps);
    }

    if (process.env.NODE_ENV === 'dev') {
        console.log('Hostring recorded:', currHotstring);
    }

    Object.keys(macros).forEach(key => {
        let macro = macros[key];
        if (
            macro.hotstring &&
            macro.hotstring === currHotstring &&
            matchMacroConditions(macro.conditions)
        ) {
            let eventData = {
                macroName: key,
                hotString: macro.hotstring,
            };

            currHotstring = '';
            fireHotstring(macro.hotstring, macro.steps);
            emitEvent(eventTypes.hotstringTriggered, eventData, eventData.hotString);
        }
    });
}

