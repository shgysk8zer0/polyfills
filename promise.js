import { polyfillMethod } from './utils.js';

if ('Promise' in globalThis) {
	polyfillMethod(Promise.prototype, 'finally', function(callback) {
		return this.then(async val => {
			await callback();
			return val;
		}, async val => {
			await callback();
			return val;
		});
	});

	polyfillMethod(Promise,  'allSettled', function(promises) {
		return Promise.all(Array.from(promises).map(function(call) {
			return new Promise(function(resolve) {
				if (! (call instanceof Promise)) {
					call = Promise.resolve(call);
				}
				call.then(function(value) {
					resolve({ status: 'fulfilled', value: value });
				}).catch(function(reason) {
					resolve({ status: 'rejected', reason: reason });
				});
			});
		}));
	});

	polyfillMethod(Promise, 'any', function(promises) {
		return new Promise((resolve, reject) => {
			let errors = [];

			promises.forEach(promise => {
				promise.then(resolve).catch(e => {
					errors.push(e);
					if (errors.length === promises.length) {
						reject(new globalThis.AggregateError(errors, 'No Promise in Promise.any was resolved'));
					}
				});
			});
		});
	});

	polyfillMethod(Promise, 'race', function(promises) {
		return new Promise((resolve, reject) => {
			promises.forEach(promise => promise.then(resolve, reject));
		});
	});

	polyfillMethod(Promise, 'try', function(callback) {
		return new Promise(resolve => resolve(callback()));
	});

	polyfillMethod(Promise, 'withResolvers', function() {
		const def = {};
		def.promise = new Promise((resolve, reject) => {
			def.resolve = resolve;
			def.reject = reject;
		});

		return def;
	});
}
