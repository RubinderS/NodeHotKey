import { getUpdatedHotstring, fireHotstring } from './utils/FireHotstring';
import { KEYCODES } from './utils/Keycodes';
import { releaseKey, pressKey } from './utils/KeyboardMouse';
import { runMacro } from './utils/RunMacro';
import { areKeysPressed } from './utils/AreKeysPressed';
import { matchCurrentWindowTitle } from './utils/Window';
const EventEmitter = require('events');

export type MacroType = {
	[key: string]: MacroObjectType;
}

type MacroObjectType = {
	hotkeys?: number[];
	hotstring?: string;
	loop?: number;
	conditions?: ConditionsType;
	steps: MacroStepType[];
}

type ConditionsType = {
	window?: string | RegExp;
}

export type MacroStepType = {
	click?: ClickType | number | number[];
	pressKey?: number;
	paste?: string;
	releaseKey?: number;
	type?: string;
	wait?: number;
	func?: FuncType;
}

export type ClickType = {
	key: number;
	modifiers?: number | number[];
	times?: number
}

export type FuncType = (
	tools: ToolsType
) => void

export type ToolsType = {
	pressKey: (keyCode: number) => void,
	releaseKey: (keyCode: number) => void,
	click: (click: ClickType) => void,
	type: (text: string) => void,
	paste: (text: string) => void,
	wait: (milliseconds: number) => void,
	setClipboardText: (text: string) => void,
	getClipboardText: () => string,
	matchCurrentWindowTitle: (title: string | RegExp) => boolean
}

export class NodeHotKey extends EventEmitter {

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
		let emptyMacrosObject = {
			'EmptyMacro': { steps: [] }
		};

		const eventTypes = {
			keyReleased: 'keyReleased',
			keyPressed: 'keyPressed',
			mouseKeyPressed: 'mouseKeyPressed',
			mouseKeyReleased: 'mouseKeyReleased',
			hotKeyTriggered: 'hotKeyTriggered',
			hotstringTriggered: 'hotstringTriggered',
			loopTriggered: 'loopTriggered'
		};

		macros = pMacros || emptyMacrosObject;
		listeningInterval = null;
		currHotstring = '';
		justRanMacro = false;
		isRobotOn = false;
		const emit = this.emit.bind(this);
		const on = this.on.bind(this);

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
				if (process.env.NODE_ENV === 'dev') console.log('Timer elapsed:', timeElapsed);

				if (timeElapsed < 10) {
					// the keys are being pressed by robot
					return true;
				} else {
					//the keys are being pressed by human
					return false;
				}
			}
			return false;
		}

		function emitEvent(eventType: string, eventData: any, outConsole: string) {
			emit(eventType, eventData);
			if (process.env.NODE_ENV === 'dev') {
				console.log(eventType + ':', outConsole)
			}
		}

		function detectHotKeyEvents() {
			if (isRobotOn === false && justRanMacro === false) {
				Object.keys(macros).forEach(key => {
					let macro = macros[key];
					if (
						macro.hotkeys &&
						areKeysPressed(macro.hotkeys, keyboardStateCurr, mouseStateCurr) &&
						matchMacroConditions(macro.conditions)
					) {
						let eventData = {
							macroName: key
						};
						emitEvent(eventTypes.hotKeyTriggered, eventData, eventData.macroName);
						justRanMacro = true;
						setTimeout(() => {
							justRanMacro = false;
						}, 500);
						doubleKeyCodes.forEach(keyCode => { releaseKey(keyCode); });
						macro.hotkeys.forEach(keyCode => {
							releaseKey(keyCode);
						});

						runMacro(macro.steps);
					}
				});
			}
		}

		function detectMouseEvents() {
			Object.keys(mouseStateCurr).forEach((keyCode: string) => {

				let eventData = {
					keyCode: keyCode,
					mouseState: mouseStateCurr,
					isRobotOn: isRobotOn
				};
				// Mouse key pressed
				if (mouseStatePrev[keyCode] === false && mouseStateCurr[keyCode] === true) {
					if (!isRobotOn) {
						isRobotOn = checkRobotOn(keyCode);
					}

					emitEvent(eventTypes.mouseKeyPressed, eventData, eventData.keyCode);
					currHotstring = '';
				}
				// Mouse key released
				if (mouseStatePrev[keyCode] === true && mouseStateCurr[keyCode] === false) {
					emitEvent(eventTypes.mouseKeyReleased, eventData, eventData.keyCode);
				}
			});
		}

		function detectKeyboardEvents() {
			Object.keys(keyboardStateCurr).forEach((keyCode: string) => {
				let eventData = {
					keyCode: keyCode,
					keyboardState: keyboardStateCurr,
					isRobotOn: isRobotOn
				};
				// Keyboard key pressed
				if (keyboardStatePrev[keyCode] === false && keyboardStateCurr[keyCode] === true) {
					if (!isRobotOn) {
						isRobotOn = checkRobotOn(keyCode);
					}

					emitEvent(eventTypes.keyPressed, eventData, eventData.keyCode);
				}
				// Keyboard key released
				if (keyboardStatePrev[keyCode] === true && keyboardStateCurr[keyCode] === false) {
					emitEvent(eventTypes.keyReleased, eventData, eventData.keyCode);
				}
			});
		}

		function detectHotstringEvents(keyCode: string, isShiftOn: boolean) {
			if (isRobotOn) {
				currHotstring = '';
			}
			else {
				currHotstring = getUpdatedHotstring(keyCode, isShiftOn, currHotstring);
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
						doubleKeyCodes.forEach(keyCode => { releaseKey(keyCode); });
						currHotstring = '';
						fireHotstring(macro.hotstring, macro.steps);
						emitEvent(eventTypes.hotstringTriggered, eventData, eventData.hotString);
					}
				});
			}
		}

		function startLoops() {
			Object.keys(macros).forEach(key => {
				let macro = macros[key];
				if (macro.loop) {
					setInterval(() => {
						if (matchMacroConditions(macro.conditions)) {
							let eventData = {
								macroName: key,
								loopInterval: macro.loop,
							};
							emitEvent(eventTypes.loopTriggered, eventData, key);
							runMacro(macro.steps);
						}
					}, macro.loop * 1000);
				}
			});
		}

		function matchMacroConditions(conditions: ConditionsType | undefined): boolean {
			// if conditions are not specified always return true
			if (conditions === undefined) {
				return true;
			}

			//start matching all the conditions one by one
			if (conditions.window && !matchCurrentWindowTitle(conditions.window)) {
				return false;
			}

			return true;
		}
		/**
		 * start listening for keyboard, mouse and Macro events
		 * @returns {void}
		 */
		this.startListening = function () {
			keyboardStatePrev = robot.Keyboard.getState();
			mouseStatePrev = robot.Mouse.getState();

			// Hotstrings
			on(eventTypes.keyPressed, (eventData: any) => {
				detectHotstringEvents(eventData.keyCode, eventData.keyboardState[KEYCODES._SHIFT]);
			});

			//Loops
			startLoops();

			listeningInterval = setInterval(() => {
				isRobotOn = false;

				// Keyboard
				keyboardStateCurr = robot.Keyboard.getState();
				detectKeyboardEvents();
				keyboardStatePrev = keyboardStateCurr;

				// Mouse
				mouseStateCurr = robot.Mouse.getState();
				detectMouseEvents();
				mouseStatePrev = mouseStateCurr;

				// Macros
				detectHotKeyEvents();
			}, 0);
		}
		/**
		 * stop listening for keyboard and mouse events
		 * @returns {void}
		 */
		this.stopListening = function () {
			if (listeningInterval) {
				clearInterval(listeningInterval);
			}
		}
	}
}