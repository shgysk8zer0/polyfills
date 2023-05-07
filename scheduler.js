import { Scheduler } from './assets/Scheduler.js';

if (! ('scheduler' in globalThis)) {
	globalThis.scheduler = new Scheduler();
}
