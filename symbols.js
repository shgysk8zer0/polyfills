import { polyfillMethod } from './utils.js';

if ('Symbol' in globalThis) {
	const known = new Set(
		Reflect.ownKeys(Symbol)
			.filter(item => typeof Symbol[item] === 'symbol')
			.map(key => Symbol[key])
	);

	if (typeof Symbol.toStringTag === 'undefined') {
		Symbol.toStringTag = Symbol('Symbol.toStringTag');
	}

	if (typeof Symbol.iterator === 'undefined') {
		Symbol.iterator = Symbol('Symbol.iterator');
	}

	polyfillMethod(Symbol, 'isRegistered', function(symbol) {
		return typeof symbol === 'symbol' && typeof Symbol.keyFor(symbol) === 'string';
	});

	polyfillMethod(Symbol, 'isWellKnown', function(symbol) {
		return known.has(symbol);
	});
}
