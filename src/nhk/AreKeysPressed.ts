
/**
 *  checks if the keys are currently pressed
 * @param keyCodeArr {number []}
 * @param keyboardState {any}
 * @param mouseState {any}
 * @returns {boolean}
 */
export function areKeysPressed(keyCodeArr: number[], keyboardState: any, mouseState: any): boolean {
    let keysArePressed = true;
    keyCodeArr.forEach(keyCode => {
        if (!keyboardState[keyCode] && !mouseState[keyCode]) keysArePressed = false;
    });
    return keysArePressed;
}