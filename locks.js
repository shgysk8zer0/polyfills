import { LockManager, actuallySupported, nativeSupport } from './assets/LockManager.js';
import { errorToEvent } from './assets/error.js';
let polyfilled = false;

const polyfilledPromise = new Promise(async resolve => {
	if (nativeSupport) {
		if (await actuallySupported) {
			resolve(false);
		} else {
			try {
				navigator.locks.request = LockManager.request;
				navigator.locks.query = LockManager.query;
				polyfilled = true;
				resolve(true);
			} catch(err) {
				globalThis.dispatchEvent(errorToEvent(err));
				resolve(false);
			}
		}
	} else {
		try {
			navigator.locks = LockManager;
			polyfilled = true;
			resolve(true);
		} catch(err) {
			globalThis.dispatchEvent(errorToEvent(err));
			resolve(false);
		}
	}
});


export { polyfilled, polyfilledPromise };
