// @ts-ignore
import robot from 'robot-js';
/**
 * get text from the clipboard
 * @returns {string}
 */
export function getClipboardText(): string {
    return robot.Clipboard.getText();
}
/**
 * set text to clipboard
 * @param text {string} text to set to clipboard
 * @returns {void} 
 */
export function setClipboardText(text: string): void {
    robot.Clipboard.setText(text);
}