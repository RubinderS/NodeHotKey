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
	pressKey: (keyCode: number) => void,
	releaseKey: (keyCode: number) => void,
	clickKey: (keyCode: number) => void,
	type: (text: string) => void,
	paste: (text: string) => void,
	wait: (milliseconds: number) => void,
	setClipboardText: (text: string) => void,
	getClipboardText: () => string
)
	=> void;

export class NodeHotKey extends EventEmitter {
	private readonly robot = require('robot-js');
	private readonly timer = this.robot.Timer();
	private readonly doubleKeyCodes = [160, 161, 162, 163, 164, 165];

	private listeningInterval: NodeJS.Timeout | null;
	private macros: MacroType;
	private currHotstring: string;
	private justRanMacro: boolean;
	private isRobotOn: boolean;
	private keyboardStatePrev: any;
	private keyboardStateCurr: any;
	private mouseStatePrev: any;
	private mouseStateCurr: any;

	public readonly eventTypes = {
		keyReleased: 'keyReleased',
		keyPressed: 'keyPressed',
		mouseKeyPressed: 'mouseKeyPressed',
		mouseKeyReleased: 'mouseKeyReleased',
		hotKeyTriggered: 'hotKeyTriggered',
		hotstringTriggered: 'hotstringTriggered',
		loopTriggered: 'loopTriggered'
	};

	private checkRobotOn(keyCode: string) {
		let timeElapsed = 0;
		// if key is in exception list don't run the function and simply return false
		// e.g. for Shift keycodes 16, 160 and 161 all are triggred together which may cause misleading results
		if (this.doubleKeyCodes.indexOf(Number(keyCode)) !== -1) return false;

		if (this.keyboardStatePrev[keyCode] !== this.keyboardStateCurr[keyCode]) {
			if (this.timer.hasStarted()) {
				timeElapsed = this.timer.getElapsed();
				this.timer.reset();
			}
			this.timer.start();
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

	private emitEvent(eventType: string, eventData: any, outConsole: string) {
		this.emit(eventType, eventData);
		if (process.env.NODE_ENV === 'dev') console.log(eventType + ':', outConsole);
	}

	private detectHotKeyEvents() {
		if (this.isRobotOn === false && this.justRanMacro === false) {
			Object.keys(this.macros).forEach(key => {
				let macro = this.macros[key];
				if (
					macro.hotkeys &&
					areKeysPressed(macro.hotkeys, this.keyboardStateCurr, this.mouseStateCurr) &&
					this.matchMacroConditions(macro.conditions)
				) {
					let eventData = {
						macroName: key
					};
					this.emitEvent(this.eventTypes.hotKeyTriggered, eventData, eventData.macroName);
					this.justRanMacro = true;
					setTimeout(() => {
						this.justRanMacro = false;
					}, 500);
					this.doubleKeyCodes.forEach(keyCode => { releaseKey(keyCode); });
					macro.hotkeys.forEach(keyCode => {
						releaseKey(keyCode);
					});

					runMacro(macro.steps);
				}
			});
		}
	}

	private detectMouseEvents() {
		Object.keys(this.mouseStateCurr).forEach((keyCode: string) => {

			let eventData = {
				keyCode: keyCode,
				mouseState: this.mouseStateCurr,
				isRobotOn: this.isRobotOn
			};
			// Mouse key pressed
			if (this.mouseStatePrev[keyCode] === false && this.mouseStateCurr[keyCode] === true) {
				if (!this.isRobotOn) {
					this.isRobotOn = this.checkRobotOn(keyCode);
				}

				this.emitEvent(this.eventTypes.mouseKeyPressed, eventData, eventData.keyCode);
				this.currHotstring = '';
			}
			// Mouse key released
			if (this.mouseStatePrev[keyCode] === true && this.mouseStateCurr[keyCode] === false) {
				this.emitEvent(this.eventTypes.mouseKeyReleased, eventData, eventData.keyCode);
			}
		});
	}

	private detectKeyboardEvents() {
		Object.keys(this.keyboardStateCurr).forEach((keyCode: string) => {
			let eventData = {
				keyCode: keyCode,
				keyboardState: this.keyboardStateCurr,
				isRobotOn: this.isRobotOn
			};
			// Keyboard key pressed
			if (this.keyboardStatePrev[keyCode] === false && this.keyboardStateCurr[keyCode] === true) {
				if (!this.isRobotOn) {
					this.isRobotOn = this.checkRobotOn(keyCode);
				}

				this.emitEvent(this.eventTypes.keyPressed, eventData, eventData.keyCode);
			}
			// Keyboard key released
			if (this.keyboardStatePrev[keyCode] === true && this.keyboardStateCurr[keyCode] === false) {
				this.emitEvent(this.eventTypes.keyReleased, eventData, eventData.keyCode);
			}
		});
	}

	private detectHotstringEvents(keyCode: string, isShiftOn: boolean) {
		if (this.isRobotOn) {
			this.currHotstring = '';
		}
		else {
			this.currHotstring = getUpdatedHotstring(keyCode, isShiftOn, this.currHotstring);
			if (process.env.NODE_ENV === 'dev') console.log('Hostring recorded:', this.currHotstring);
			Object.keys(this.macros).forEach(key => {
				let macro = this.macros[key];
				if (
					macro.hotstring &&
					macro.hotstring === this.currHotstring &&
					this.matchMacroConditions(macro.conditions)
				) {
					let eventData = {
						macroName: key,
						hotString: macro.hotstring,
					};
					this.doubleKeyCodes.forEach(keyCode => { releaseKey(keyCode); });
					this.currHotstring = '';
					fireHotstring(macro.hotstring, macro.steps);
					this.emitEvent(this.eventTypes.hotstringTriggered, eventData, eventData.hotString);
				}
			});
		}
	}

	private startLoops() {
		Object.keys(this.macros).forEach(key => {
			let macro = this.macros[key];
			if (macro.loop) {
				setInterval(() => {
					if (this.matchMacroConditions(macro.conditions)) {
						let eventData = {
							macroName: key,
							loopInterval: macro.loop,
						};
						this.emitEvent(this.eventTypes.loopTriggered, eventData, key);
						runMacro(macro.steps);
					}
				}, macro.loop * 1000);
			}
		});
	}

	private matchMacroConditions(conditions: ConditionsType | undefined): boolean {
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

	public constructor(macros?: MacroType) {
		super();
		let emptyMacrosObject = {
			'EmptyMacro': { steps: [] }
		};
		this.macros = macros || emptyMacrosObject;
		this.listeningInterval = null;
		this.currHotstring = '';
		this.justRanMacro = false;
		this.isRobotOn = false;
	}
	/**
	 * start listening for keyboard, mouse and Macro events
	 * @returns {void}
	 */
	public startListening() {
		this.keyboardStatePrev = this.robot.Keyboard.getState();
		this.mouseStatePrev = this.robot.Mouse.getState();

		// Hotstrings
		this.on(this.eventTypes.keyPressed, (eventData: any) => {
			this.detectHotstringEvents(eventData.keyCode, eventData.keyboardState[KEYCODES._SHIFT]);
		});

		this.startLoops();

		this.listeningInterval = setInterval(() => {
			this.isRobotOn = false;

			// Keyboard
			this.keyboardStateCurr = this.robot.Keyboard.getState();
			this.detectKeyboardEvents();
			this.keyboardStatePrev = this.keyboardStateCurr;

			// Mouse
			this.mouseStateCurr = this.robot.Mouse.getState();
			this.detectMouseEvents();
			this.mouseStatePrev = this.mouseStateCurr;

			// Macros
			this.detectHotKeyEvents();
		}, 0);
	}
	/**
	 * stop listening for keyboard and mouse events
	 * @returns {void}
	 */
	public stopListening() {
		if (this.listeningInterval) clearInterval(this.listeningInterval);
	}

}