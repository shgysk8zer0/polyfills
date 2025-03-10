/**
 * @copyright 2024 Chris Zuber <admin@kernvalley.us>
 */
export const PRIORITIES = {
	blocking: 'user-blocking',
	visible: 'user-visible',
	background: 'background',
};

async function delayCallback(cb, { delay = 0, signal } = {}) {
	const { promise, resolve, reject } = Promise.withResolvers();

	if (signal instanceof AbortSignal && signal.aborted) {
		reject(signal.reason);
	} else {
		const controller = new AbortController();
		const handle = setTimeout(async () => {
			await Promise.try(cb).then(resolve, reject);
			controller.abort();
		}, delay);

		if (signal instanceof AbortSignal) {
			signal.addEventListener('abort', ({ target }) => {
				reject(target.reason);
				clearTimeout(handle);
				controller.abort(target.reason);
			}, { once: true, signal: controller.signal });
		}
	}

	return await promise;
}

function getTaskCallback(callback, resolve, reject, signal) {
	return async () => {
		if (signal instanceof AbortSignal && signal.aborted) {
			reject(signal.reason);
		} else if (! (callback instanceof Function)) {
			reject(new TypeError('Scheduled task is not a function.'));
		} else {
			await Promise.try(callback).then(resolve, reject);
		}
	};
}

export class Scheduler {
	async postTask(callback, {
		priority,
		delay,
		signal,
	} = {}) {
		const { promise, resolve, reject } = Promise.withResolvers();
		const controller = new AbortController();
		const hasDelay = Number.isSafeInteger(delay) && delay > -1;
		const taskCallback = getTaskCallback(callback, resolve, reject, signal);

		if (typeof priority === 'undefined') {
			priority = signal instanceof globalThis.TaskSignal ? signal.priority : PRIORITIES.visible;
		}

		if (signal instanceof AbortSignal && signal.aborted) {
			reject(signal.reason);
		} else {
			switch(priority) {
				case PRIORITIES.blocking:
					if (hasDelay) {
						await delayCallback(taskCallback, { delay, signal });
					} else {
						await Promise.resolve();
						queueMicrotask(taskCallback);
					}

					break;

				case PRIORITIES.visible:
					if (hasDelay) {
						await delayCallback(() => requestAnimationFrame(taskCallback), { delay, signal });
					} else {
						const handle = requestAnimationFrame(taskCallback);

						if (signal instanceof AbortSignal) {
							signal.addEventListener('abort', ({ target }) => {
								cancelAnimationFrame(handle);
								reject(target.reason);
								controller.abort(target.reason);
							}, { once: true, signal: controller.signal });
						}
					}

					break;

				case PRIORITIES.background:
					if (hasDelay) {
						await delayCallback(() => requestIdleCallback(taskCallback), { delay, signal });
					} else {
						const handle = requestIdleCallback(taskCallback);

						if (signal instanceof AbortSignal) {
							signal.addEventListener('abort', ({ target }) => {
								cancelIdleCallback(handle);
								reject(target.reason);
								controller.abort(target.reason);
							}, { once: true, signal: controller.signal });
						}
					}

					break;

				default:
					throw new TypeError(`Scheduler.postTask: '${priority}' (value of 'priority' member of SchedulerPostTaskOptions) is not a valid value for enumeration TaskPriority.`);
			}
		}

		return await promise.then(result => {
			controller.abort();
			return result;
		}).catch(err => {
			controller.abort(err);
			throw err;
		});
	}

	async yield() {
		await this.postTask(() => null, { priority: PRIORITIES.visible });
	}
}
