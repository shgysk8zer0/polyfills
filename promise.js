import { polyfillMethod } from './utils.js';

if ('Promise' in globalThis) {
	polyfillMethod(Promise, 'try', (callback, ...args) => new Promise(resolve => resolve(callback(...args))));

	polyfillMethod(Promise, 'withResolvers', function withResolvers() {
		const def = {};

		def.promise = new Promise((resolve, reject) => {
			def.resolve = resolve;
			def.reject = reject;
		});

		return def;
	});

	polyfillMethod(Promise, 'fromEntries', async function fromEntries(entries) {
		const keys = [];
		const values = [];

		for (const [key, value] of entries) {
			keys.push(key);
			values.push(value);
		}

		return await Promise.all(values)
			.then(values => Object.fromEntries(values.map((value, i) => [keys[i], value])));
	});

	polyfillMethod(Promise, 'ownProperties', function ownProperties(obj) {
		return Promise.fromEntries(Object.entries(obj));
	});

	polyfillMethod(Promise, 'allKeyed', async function allKeyed(obj) {
		if (obj === null || typeof obj !== 'object') {
			throw new TypeError('Argument must be an object');
		} else {
			const keys = Reflect.ownKeys(obj);
			const values = await Promise.all(keys.map(k => obj[k]));

			return Object.fromEntries(Iterator.zip([keys, values]));
		}
	});

	polyfillMethod(Promise, 'allSettledKeyed', async function allSettledKeyed(obj) {
		if (obj === null || typeof obj !== 'object') {
			throw new TypeError('Argument must be an object');
		} else {
			const keys = Reflect.ownKeys(obj);
			const results = await Promise.allSettled(keys.map(k => obj[k]));

			return Object.fromEntries(Iterator.zip([keys, results]));
		}
	});
}
