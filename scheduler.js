import { Scheduler } from './assets/Scheduler.js';

if (! ('scheduler' in globalThis)) {
	globalThis.scheduler = new Scheduler();
} else if (! (globalThis.scheduler.yield instanceof Function)) {
	globalThis.scheduler.yield = async function(opts) {
		await Scheduler.prototype.yield.call(this, opts);
	};
}

if (! ('TaskController' in globalThis)) {
	const PRIORITIES = ['user-visible', 'user-blocking', 'background'];
	const PRIORITY_SYMBOL = Symbol('task:priority');

	globalThis.TaskPriorityChangeEvent = class TaskPriorityChangeEvent extends Event {
		#previousPriority;

		constructor(type, { previousPriority }) {
			super(type);

			if (typeof previousPriority !== 'string') {
				throw new TypeError('TaskPriorityChangeEvent constructor: Missing required \'previousPriority\' member of TaskPriorityChangeEventInit.');
			} else if (! PRIORITIES.includes(previousPriority)) {
				throw new TypeError(`TaskPriorityChangeEvent constructor: '${previousPriority}' (value of 'previousPriority' member of TaskPriorityChangeEventInit) is not a valid value for enumeration TaskPriority.`);
			} else {
				this.#previousPriority = previousPriority;
			}
		}

		get previousPriority() {
			return this.#previousPriority;
		}
	};

	globalThis.TaskSignal = class TaskSignal extends AbortSignal {
		get priority() {
			return this[PRIORITY_SYMBOL];
		}

		static any(signals, { priority = 'user-visible' } = {}) {
			if (! PRIORITIES.includes(priority)) {
				throw new TypeError(`TaskSignal.any: '${priority}' is not a valid value for enumeration TaskPriority.`);
			} else {
				const signal = super.any(signals);

				Object.setPrototypeOf(signal, globalThis.TaskSignal.prototype);
				Object.defineProperty(signal, PRIORITY_SYMBOL, {
					enumerable: false,
					writable: true,
					configurable: false,
					value: priority,
				});

				return signal;
			}
		}
	};

	globalThis.TaskController = class TaskController extends AbortController {
		constructor({ priority = 'user-visible' } = {}) {
			super();

			if (! PRIORITIES.includes(priority)) {
				throw new TypeError(`TaskController constructor: '${priority}' (value of 'priority' member of TaskControllerInit) is not a valid value for enumeration TaskPriority.`);
			} else {
				Object.setPrototypeOf(this.signal, globalThis.TaskSignal.prototype);
				Object.defineProperty(this.signal, PRIORITY_SYMBOL, {
					enumerable: false,
					writable: true,
					configurable: false,
					value: priority,
				});
			}
		}

		setPriority(value) {
			if (! PRIORITIES.includes(value)) {
				throw new TypeError(`TaskController.setPriority: '${value}' (value of argument 1) is not a valid value for enumeration TaskPriority.`);
			} else if (value !== this.signal.priority) {
				const event = new globalThis.TaskPriorityChangeEvent('prioritychange', { previousPriority: this.signal.priority });
				this.signal[PRIORITY_SYMBOL] = value;
				this.signal.dispatchEvent(event);
			}
		}
	};
}
