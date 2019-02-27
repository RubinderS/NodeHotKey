/**
 * waits synchronously
 * @param milliseconds {number} time to wait
 * @returns {void}
 */
export function wait(milliseconds: number): void {
	let currTime = new Date().getTime();
	while (new Date().getTime() < currTime + milliseconds);
}