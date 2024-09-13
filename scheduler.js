import { Scheduler } from './assets/Scheduler.js';

if (! ('scheduler' in globalThis)) {
	globalThis.scheduler = new Scheduler();
} else if (! (globalThis.scheduler.yield instanceof Function)) {
	globalThis.scheduler.yield = async function(opts) {
		await Scheduler.prototype.yield.call(this, opts);
	};
}
