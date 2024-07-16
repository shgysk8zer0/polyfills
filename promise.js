if ('Promise' in globalThis) {
	if (! (Promise.prototype.finally instanceof Function)) {
		Promise.prototype.finally = function(callback) {
			return this.then(async val => {
				await callback();
				return val;
			}, async val => {
				await callback();
				return val;
			});
		};
	}

	if (! (Promise.allSettled instanceof Function)) {
		Promise.allSettled = function(promises) {
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
		};
	}

	if (! (Promise.any instanceof Function)) {
		Promise.any = (promises) => new Promise((resolve, reject) => {
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
	}

	if (! (Promise.race instanceof Function)) {
		Promise.race = (promises) => new Promise((resolve, reject) => {
			promises.forEach(promise => promise.then(resolve, reject));
		});
	}

	if (! (Promise.try instanceof Function)) {
		/**
		 * @see https://github.com/tc39/proposal-promise-try
		 */
		Promise.try = callback => new Promise(resolve => resolve(callback()));
	}

	if (! (Promise.withResolvers instanceof Function)) {
		Promise.withResolvers = function() {
			const def = {};
			def.promise = new Promise((resolve, reject) => {
				def.resolve = resolve;
				def.reject = reject;
			});

			return def;
		};
	}

	if (! (Promise.fromEntries instanceof Function)) {
		Promise.fromEntries = async function fromEntries(entries) {
			const keys = [];
			const values = [];

			for (const [key, value] of entries) {
				keys.push(key);
				values.push(value);
			}

			return await Promise.all(values)
				.then(values => Object.fromEntries(values.map((value, i) => [keys[i], value])));
		};
	}

	if (!(Promise.ownProperties instanceof Function)) {
		Promise.ownProperties = async function ownProperties(obj) {
			return await Promise.fromEntries(Object.entries(obj));
		};
	}
}
