/* global Record Tuple */
if (! (JSON.parseImmutable instanceof Function)) {
	/* eslint-disable no-inner-declarations */

	function getImmutable(thing) {
		switch (typeof thing) {
			case 'object':
				if (thing === null) {
					return null;
				} else if (Array.isArray(thing)) {
					return Tuple.from(thing.map(item => getImmutable(item)));
				}
				return Record.fromEntries(
					Object.entries(thing).map(([key, val]) => [key, getImmutable(val)])
				);

			default:
				return thing;
		}
	}

	JSON.parseImmutable = function parseImmutable(str) {
		return JSON.parse(str, (_, value) => getImmutable(value));
	};
}


if (! (JSON.rawJSON instanceof Function)) {
	const rawKey = Symbol('raw-json');
	const _stringify = JSON.stringify;

	JSON.isRawJSON = function isRawJSON(thing) {
		return typeof thing === 'object' && thing !== null && Object.hasOwn(thing, rawKey);
	};

	JSON.rawJSON = function rawJSON(rawJSON) {
		try {
			const result = JSON.parse(rawJSON);

			if (typeof result === 'object' && result !== null) {
				throw new SyntaxError('Invalid raw JSON.');
			} else {
				const rawObj = Object.create({ rawJSON }, {
					[rawKey]: {
						value: result,
						enumerable: false,
						writable: false,
						configurable: false,
					},
				});

				return Object.freeze(rawObj);
			}
		} catch(err) {
			if (err instanceof SyntaxError) {
				throw err;
			} else {
				throw new SyntaxError('Invalid JSON.');
			}
		}
	};

	JSON.stringify = function stringify(obj, replacer, space) {
		switch (typeof obj) {
			case 'object':
				if (JSON.isRawJSON(obj)) {
					return obj.rawJSON;
				} else if (obj === null) {
					return 'null';
				} else if (obj.toJSON instanceof Function) {
					return JSON.stringify(obj.toJSON(), replacer, space);
				} else if (Array.isArray(obj)) {
					return '[' + obj.map(item => JSON.stringify(item, replacer, space)).join(',') + ']';
				} else {
					return '{' + Object.entries(obj).map(([k, v]) => `"${k}": ${JSON.stringify(v)}`).join(',') + '}';
				}

			default:
				return _stringify(obj);
		}
	};
}
