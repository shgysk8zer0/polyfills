const funcs = new WeakMap();

export const between = (min, val, max) => typeof val === 'number' && val >= min && val <= max;

export function getDeferred() {
	if (Promise.withResolvers instanceof Function) {
		return Promise.withResolvers();
	} else {
		const def = {};
		def.promise = new Promise((resolve, reject) => {
			def.resolve = resolve;
			def.reject = reject;
		});

		return def;
	}
}

export function isAsyncFunction(what) {
	return what instanceof Function && what.constructor.name === 'AsyncFunction';
}

export function isAsync(what) {
	return isAsyncFunction(what) || what instanceof  Promise;
}

export function isObject(thing) {
	return typeof thing === 'object' && ! Object.is(thing, null) && ! Array.isArray(thing);
}

export function getType(thing) {
	switch (typeof thing) {
		case 'undefined':
			return 'Undefined';

		case 'function':
			if ('prototype' in thing) {
				return getType(thing.prototype);
			} else if ('constructor' in thing) {
				return thing.constructor.name;
			} else {
				return 'Function';
			}

		case 'object':
			if (Object.is(thing, null)) {
				return 'Null';
			} else if ('constructor' in thing) {
				return thing.constructor.name;
			} else if (Symbol.toStringTag in thing) {
				return thing[Symbol.toStringTag];
			} else if ('prototype' in thing) {
				return  getType(thing.prototype);
			} else {
				console.log(thing);
				return 'Unknown Object';
			}

		case 'string':
			return 'String';

		case 'number':
			return Number.isNaN(thing) ? 'NaN' : 'Number';

		case 'bigint':
			return 'BigInt';

		case 'boolean':
			return 'Boolean';

		case 'symbol':
			return 'Symbol';

		default:
			return 'Unknown';
	}
}

export function callOnce(callback, thisArg) {
	if (callback.once instanceof Function) {
		return callback.once(thisArg);
	} else {
		return function(...args) {
			if (funcs.has(callback)) {
				return funcs.get(callback);
			} else if (isAsyncFunction(callback)) {
				const retVal = callback.apply(thisArg || this, args).catch(err => {
					funcs.delete(callback);
					throw err;
				});

				funcs.set(callback, retVal);
				return retVal;
			} else if (callback instanceof Function) {
				const retVal = callback.apply(thisArg || this, args);
				funcs.set(callback, retVal);
				return retVal;
			}
		};
	}
}
