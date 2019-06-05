import { ConditionsType, KeyStateType, MacroType } from '../../types/nhk-types';
import { click, releaseKey } from '../utils/KeyboardMouse';
import { KEYCODES } from '../utils/Keycodes';
import { matchCurrentWindowTitle } from '../utils/Window';
import { keyCodeToPrintableChar } from './KeyCodeToPrintableChar';
import { runMacro } from './RunMacro';
// tslint:disable-next-line: no-var-requires
const EventEmitter = require('events');

export class NodeHotKey extends EventEmitter {
  /**
   * start listening for keyboard, mouse and Macro events
   * @returns {void}
   */
  public startListening: () => void;

  /**
   * stop listening for keyboard and mouse events
   * @returns {void}
   */
  public stopListening: () => void;

  public readonly eventTypes: { [key: string]: string };

  public constructor(pMacros?: MacroType) {
    super();
    const robot = require('robot-js');
    const timer = robot.Timer();
    const doubleKeyCodes = [160, 161, 162, 163, 164, 165];

    let listeningInterval: NodeJS.Timeout | null;
    let macros: MacroType;
    let currHotstring: string;
    let justRanMacro: boolean;
    let isRobotOn: boolean;
    let keyboardStatePrev: any;
    let keyboardStateCurr: any;
    let mouseStatePrev: any;
    let mouseStateCurr: any;
    const emptyMacrosObject = {
      EmptyMacro: { steps: [] },
    };

    const eventTypes = {
      hotKeyTriggered: 'hotKeyTriggered',
      hotstringTriggered: 'hotstringTriggered',
      keyPressed: 'keyPressed',
      keyReleased: 'keyReleased',
      loopTriggered: 'loopTriggered',
      mouseKeyPressed: 'mouseKeyPressed',
      mouseKeyReleased: 'mouseKeyReleased',
    };
    const emit = this.emit.bind(this);
    const on = this.on.bind(this);

    macros = pMacros || emptyMacrosObject;
    listeningInterval = null;
    currHotstring = '';
    justRanMacro = false;
    isRobotOn = false;

    function checkRobotOn(keyCode: string) {
      let timeElapsed = 0;
      // if key is in exception list don't run the function and simply return false
      // e.g. for Shift keycodes 16, 160 and 161 all are triggred together which may cause misleading results
      if (doubleKeyCodes.indexOf(Number(keyCode)) !== -1) {
        return false;
      }

      if (keyboardStatePrev[keyCode] !== keyboardStateCurr[keyCode]) {
        if (timer.hasStarted()) {
          timeElapsed = timer.getElapsed();
          timer.reset();
        }
        timer.start();
        if (process.env.NODE_ENV === 'dev') {
          console.log('Timer elapsed:', timeElapsed);
        }

        if (timeElapsed < 10) {
          // the keys are being pressed by robot
          return true;
        } else {
          // the keys are being pressed by human
          return false;
        }
      }
      return false;
    }

    function emitEvent(eventType: string, outConsole: string, eventData: any) {
      emit(eventType, eventData);
      if (process.env.NODE_ENV === 'dev') {
        console.log(eventType + ':', outConsole);
      }
    }

    function startLoops() {
      Object.keys(macros).forEach((key) => {
        const macro = macros[key];
        if (macro.loop) {
          setInterval(() => {
            if (matchMacroConditions(macro.conditions)) {
              emitEvent(eventTypes.loopTriggered, key, {
                loopInterval: macro.loop,
                macroName: key,
              });
              runMacro(macro.steps);
            }
          }, macro.loop * 1000);
        }
      });
    }

    function isKeyPressed(keyStatePrev: KeyStateType, keyStateCurr: KeyStateType, keyCode: string): boolean {
      if (keyStatePrev[keyCode] === false && keyStateCurr[keyCode] === true) {
        return true;
      }
      return false;
    }

    function isKeyReleased(keyStatePrev: KeyStateType, keyStateCurr: KeyStateType, keyCode: string): boolean {
      if (keyStatePrev[keyCode] === true && keyStateCurr[keyCode] === false) {
        return true;
      }
      return false;
    }

    function keyboardPressReleaseEvents(keyStatePrev: KeyStateType, keyStateCurr: KeyStateType, keyCode: string): void {

      // key pressed
      if (isKeyPressed(keyStatePrev, keyStateCurr, keyCode)) {
        emitEvent(eventTypes.keyPressed, `${keyCode} pressed`, {
          keyBoardState: keyStateCurr,
          keyCode,
          printableChar: keyCodeToPrintableChar(Number(keyCode), keyStateCurr[KEYCODES._SHIFT]),
        });
      }

      // key released
      if (isKeyReleased(keyStatePrev, keyStateCurr, keyCode)) {
        emitEvent(eventTypes.keyReleased, `${keyCode} released`, {
          keyBoardState: keyStateCurr,
          keyCode,
          printableChar: keyCodeToPrintableChar(Number(keyCode), keyStateCurr[KEYCODES._SHIFT]),
        });
      }
    }

    function mousePressReleaseEvents(keyStatePrev: KeyStateType, keyStateCurr: KeyStateType, keyCode: string): void {
      // key pressed
      if (isKeyPressed(keyStatePrev, keyStateCurr, keyCode)) {
        emitEvent(eventTypes.keyPressed, `${keyCode} pressed`,
          {
            keyBoardState: keyStateCurr,
            keyCode,
            printableChar: keyCodeToPrintableChar(Number(keyCode), keyStateCurr[KEYCODES._SHIFT]),
          });
      }
      // key released
      if (isKeyReleased(keyStatePrev, keyStateCurr, keyCode)) {
        emitEvent(eventTypes.keyReleased, `${keyCode} released`,
          {
            keyBoardState: keyStateCurr,
            keyCode,
            printableChar: keyCodeToPrintableChar(Number(keyCode), keyStateCurr[KEYCODES._SHIFT]),
          });
      }
    }

    function matchMacroConditions(conditions: ConditionsType | undefined): boolean {
      // if conditions are not specified always return true
      if (conditions === undefined) {
        return true;
      }

      // start matching all the conditions one by one
      if (conditions.window && !matchCurrentWindowTitle(conditions.window)) {
        return false;
      }

      return true;
    }

    function detectHotKeyEvents() {
      function areKeysPressed(keyCodeArr: number[], keyState: any, mouseState: any): boolean {
        let keysArePressed = true;
        keyCodeArr.forEach((keyCode) => {
          if (!keyState[keyCode] && !mouseState[keyCode]) {
            keysArePressed = false;
          }
        });
        return keysArePressed;
      }

      if (justRanMacro === false) {
        Object.keys(macros).forEach((key) => {
          const macro = macros[key];
          if (
            macro.hotkeys &&
            areKeysPressed(macro.hotkeys, keyboardStateCurr, mouseStateCurr) &&
            matchMacroConditions(macro.conditions)
          ) {
            emitEvent(
              eventTypes.hotKeyTriggered, `${key}`, {
                macroName: key,
              });

            justRanMacro = true;
            setTimeout(() => {
              justRanMacro = false;
            }, 500);

            doubleKeyCodes.forEach((keyCode) => releaseKey(keyCode));
            macro.hotkeys.forEach((keyCode) => releaseKey(keyCode));
            runMacro(macro.steps);
          }
        });
      }
    }

    function detectHotstringEvents(keyCode: string, isShiftOn: boolean): void {
      // update currHotstring
      const keyPressedCodeNumber = Number(keyCode);
      const char: string = keyCodeToPrintableChar(keyPressedCodeNumber, isShiftOn);
      // shift key is exception for hotstring capture
      if (char === '' && keyPressedCodeNumber !== 16 && keyPressedCodeNumber !== 160 && keyPressedCodeNumber !== 161) {
        currHotstring = '';
      } else {
        currHotstring += char;
      }

      if (process.env.NODE_ENV === 'dev') {
        console.log('Hostring recorded:', currHotstring);
      }

      // match currHotstring in macros
      Object.keys(macros).forEach((key) => {
        const macro = macros[key];
        if (
          macro.hotstring &&
          macro.hotstring === currHotstring &&
          matchMacroConditions(macro.conditions)
        ) {
          doubleKeyCodes.forEach((code) => { releaseKey(code); });
          currHotstring = '';

          if (macro.steps[0].type !== undefined || macro.steps[0].paste !== undefined) {
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < macro.hotstring.length; i++) {
              click(KEYCODES._BACKSPACE);
            }
          }

          emitEvent(eventTypes.hotstringTriggered, macro.hotstring, {
            hotString: macro.hotstring,
            macroName: key,
          });
          runMacro(macro.steps);
        }
      });
    }

    function startListening() {
      keyboardStatePrev = robot.Keyboard.getState();
      mouseStatePrev = robot.Mouse.getState();

      on(eventTypes.keyPressed, (eventData: any) => {
        // Hotstrings
        if (!isRobotOn) {
          detectHotstringEvents(eventData.keyCode, eventData.keyBoardState[KEYCODES._SHIFT]);
        } else {
          currHotstring = '';
        }
      });

      // Loops
      startLoops();

      listeningInterval = setInterval(() => {
        // keyboard
        keyboardStateCurr = robot.Keyboard.getState();
        Object.keys(keyboardStateCurr).forEach((keyCode: string) => {
          isRobotOn = checkRobotOn(keyCode);
          keyboardPressReleaseEvents(keyboardStatePrev, keyboardStateCurr, keyCode);
        });
        keyboardStatePrev = keyboardStateCurr;

        // Mouse
        mouseStateCurr = robot.Mouse.getState();
        Object.keys(mouseStateCurr).forEach((keyCode: string) => {
          mousePressReleaseEvents(mouseStateCurr, mouseStatePrev, keyCode);
        });
        mouseStatePrev = mouseStateCurr;

        // Macros
        if (!isRobotOn) {
          // hotkeys
          detectHotKeyEvents();
        }

      }, 0);
    }

    function stopListening() {
      if (listeningInterval) {
        clearInterval(listeningInterval);
      }
    }

    this.startListening = startListening;
    this.stopListening = stopListening;
    this.eventTypes = eventTypes;
  }
}
