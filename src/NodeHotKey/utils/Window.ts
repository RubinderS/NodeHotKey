// @ts-ignore
import robot from 'robot-js';

/**
 * checks if current active window's title matches the given string or regexp
 * @param title title to match
 * @returns {boolean} true the current active window's title matches the given argument
 */
export function matchCurrentWindowTitle(title: string | RegExp): boolean {
    let windowTitle: string = robot.Window.getActive();
    let titleRegExp: RegExp;

    if (typeof title === 'string') {
        titleRegExp = new RegExp(`^${escapeRegExp(title)}$`);
    } else if (title instanceof RegExp) {
        titleRegExp = title;
    } else {
        titleRegExp = /.*/g; // make it match everything in unexpected scenario
    }

    return windowTitle.match(titleRegExp) !== null;
}

function escapeRegExp(s: string) {
    return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}