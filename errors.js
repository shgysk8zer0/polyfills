import { errorToEvent } from './assets/error.js';

if (! globalThis.hasOwnProperty('AggregateError')) {
	globalThis.AggregateError = class AggregateError extends Error {
		constructor(errors, message) {
			if (typeof message === 'undefined') {
				super(errors);
				this.errors = [];
			} else {
				super(message);
				this.errors = errors;
			}
		}
	};
}

if (! (globalThis.reportError instanceof Function)) {
	globalThis.reportError = function reportError(error) {
		globalThis.dispatchEvent(errorToEvent(error));
	};
}


if (! (Error.isError instanceof Function)) {
	// @see https://github.com/tc39/proposal-is-error/blob/main/polyfill.js
	const toStr = Function.bind.call(Function.call, Object.prototype.toString);

	Error.isError = function isError(arg) {
		return arg instanceof Error || (typeof arg === 'object' && toStr(arg) === '[object Error]' && arg[Symbol.toStringTag] === undefined);
	};
}
