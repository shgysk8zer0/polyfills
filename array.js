/**
 * @SEE https://github.com/tc39/proposal-relative-indexing-method#polyfill
 * @SEE https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray
 */

const SHIM_TARGETS = [Array, String, globalThis.Int8Array, globalThis.Uint8Array,
	globalThis.Uint8ClampedArray, globalThis.Int16Array, globalThis.Uint16Array,
	globalThis.Int32Array, globalThis.Uint32Array, globalThis.Float32Array,
	globalThis.Float64Array, globalThis.BigInt64Array, globalThis.BigUint64Array,
];

if (! (Array.prototype.flat instanceof Function)) {
	Array.prototype.flat = function(depth = 1) {
		const result = [];
		depth = Math.min(Number.MAX_SAFE_INTEGER, Math.max(0, depth));

		const flattenFn = (item, depth) => {
			if (Array.isArray(item) && depth >= 0) {
				item.forEach(i => flattenFn(i, depth - 1));
			} else {
				result.push(item);
			}
		};

		flattenFn(this, Number.isNaN(depth) ? 0 : depth);
		return result;
	};
}

if (! (Array.prototype.flatMap instanceof Function)) {
	Array.prototype.flatMap = function(cb, thisArg) {
		return this.map(cb, thisArg).flat(1);
	};
}

if (! (Array.prototype.findLast instanceof Function)) {
	Array.prototype.findLast = function(callback, thisArg) {
		let found = undefined;

		this.forEach((item, index, arr) => {
			if (callback.call(thisArg, item, index, arr)) {
				found = item;
			}
		}, thisArg);

		return found;
	};
}

if(! ('lastIndex' in Array.prototype)) {
	Object.defineProperty(Array.prototype, 'lastIndex', {
		enumerable: false,
		configurable: false,
		get: function() {
			return Math.max(0, this.length - 1);
		}
	});
}

if(! ('lastItem' in Array.prototype)) {
	Object.defineProperty(Array.prototype, 'lastItem', {
		enumerable: false,
		configurable: false,
		get: function() {
			return this[this.lastIndex];
		},
		set: function(val) {
			this[this.lastIndex] = val;
		}
	});
}

if (! (Array.prototype.findLastIndex instanceof Function)) {
	Array.prototype.findLastIndex = function(callback, thisArg) {
		let found = -1;

		this.forEach((item, index, arr) => {
			if (callback.call(thisArg, item, index, arr)) {
				found = index;
			}
		}, thisArg);

		return found;
	};
}

if (! (Array.prototype.at instanceof Function)) {
	const at = function at(n) {
		n = Math.trunc(n) || 0;
		if (n < 0) n += this.length;
		if (n < 0 || n >= this.length) return undefined;
		return this[n];
	};

	for (const C of SHIM_TARGETS) {
		if (typeof C !== 'undefined') {
			Object.defineProperty(C.prototype, 'at', {
				value: at,
				writable: true,
				enumerable: false,
				configurable: true
			});
		}
	}
}

/**
 * @deprecated [moved to `Object.groupBy()`]
 * @see https://github.com/tc39/proposal-array-grouping
 */
if (! (Array.prototype.group instanceof Function) && Object.groupBy instanceof Function) {
	Array.prototype.group = function group(callback) {
		console.warn('`Array.group()` is deprecated. Please use `Object.groupBy()` instead.');
		return Object.groupBy(this, callback);
	};
}

/**
 * @deprecated [moved to `Object.groupBy()`]
 */
if (! (Array.prototype.groupBy instanceof Function) && Object.groupBy instanceof Function) {
	Array.prototype.groupBy = function groupBy(callback) {
		console.warn('`Array.goupBy()` is deprecated. Please use `Object.groupBy()` instead.');
		return Object.groupBy(this, callback);
	};
}

/**
 * @see https://github.com/tc39/proposal-array-grouping
 * @deprecated [moved to `Map.groupBy()`]
 * @requires `Map.prototype.emplace`
 */
if (! (Array.prototype.groupToMap instanceof Function) && (Map.groupBy instanceof Function)) {
	Array.prototype.groupToMap = function groupToMap(callback) {
		console.warn('`Array.groupToMap()` is deprecated. Please use `Map.groupBy()` instead.');
		return Map.groupBy(this, callback);
	};
}

/**
 * @deprecated [moved to `Map.groupBy()`]
 */
if (Map.groupBy instanceof Function) {
	Array.prototype.groupByToMap = function groupByToMap(callback) {
		console.warn('`Array.groupByToMap()` is deprecated. Please use `Map.groupBy()` instead.');
		return Map.groupBy(this, callback);
	};
}

/**
 * @see https://github.com/tc39/proposal-array-from-async
 */
if (! (Array.fromAsync instanceof Function)) {
	Array.fromAsync = async function fromAsync(items, mapFn, thisArg = globalThis) {
		let arr = [];

		for await (const item of items) {
			arr.push(await item);
		}

		return Array.from(arr, mapFn, thisArg);
	};
}

/**
 * @see https://github.com/tc39/proposal-array-equality/
 */
if (! (Array.prototype.equals instanceof Function)) {
	Array.prototype.equals = function equals(arr) {
		if (this === arr) {
			return true;
		} else if (! Array.isArray(arr)) {
			return false;
		} else if (this.length !== arr.length) {
			return false;
		} else {
			return this.every((item, i) => {
				const val = arr[i];
				if (Array.isArray(item)) {
					return Array.isArray(val) && item.equals(val);
				} else {
					return Object.is(item, val);
				}
			});
		}
	};
}
/**
 * @see https://github.com/tc39/proposal-array-unique
 */
if (! (Array.prototype.uniqueBy instanceof Function)) {
	Array.prototype.uniqueBy = function uniqueBy(arg) {
		if (typeof arg === 'undefined') {
			return [...new Set(this)];
		} else if (typeof arg === 'string') {
			const found = [];

			return this.filter(obj => {
				const key = obj[arg];
				if (found.includes(key)) {
					return false;
				} else {
					found.push(key);
					return true;
				}
			});
		} else if (arg instanceof Function) {
			const found = [];

			return this.filter((...args) => {
				try {
					const key = arg.apply(this, args);

					if (typeof key !== 'string') {
						return false;
					} else if (found.includes(key)) {
						return false;
					} else {
						found.push(key);
						return true;
					}
				} catch(err) {
					return false;
				}
			});
		} else {
			throw new TypeError('Not a valid argument for uniqueBy');
		}
	};
}

/**
 * Change Array by copy proposal
 * @Note: Not clear if should use `structedClone` or `[...this]` for copies
 * @see https://github.com/tc39/proposal-change-array-by-copy
 */
if (! (Array.prototype.toReversed instanceof Function)) {
	Array.prototype.toReversed = function toReversed() {
		return [...this].reverse();
	};
}

if (! (Array.prototype.toSorted instanceof Function)) {
	Array.prototype.toSorted = function toSorted(cmpFn) {
		return [...this].sort(cmpFn);
	};
}

if (! (Array.prototype.toSpliced instanceof Function)) {
	Array.prototype.toSpliced = function toSpliced(start, deleteCount, ...items) {
		const cpy = [...this];
		cpy.splice(start, deleteCount, ...items);
		return cpy;
	};
}

if (! (Array.prototype.with instanceof Function)) {
	Array.prototype.with = function (index, value) {
		const cpy = [...this];
		cpy[index] = value;
		return cpy;
	};
}

if (! (Array.isTemplateObject instanceof Function)) {
	Array.isTemplateObject = function(target) {
		if (! (
			Array.isArray(target) && Array.isArray(target.raw)
			&& Object.isFrozen(target) && Object.isFrozen(target.raw)
		)) {
			return false;
		} else {
			return target.length !== 0 && target.length === target.raw.length;
		}
	};
}

/**
 * @see https://github.com/tc39/proposal-arraybuffer-base64
 */
if (! (Uint8Array.prototype.toHex instanceof Function)) {
	Uint8Array.prototype.toHex = function toHex() {
		return Array.from(this).map(n => n.toString(16).padStart('0', 2)).join('');
	};
}

if (! (Uint8Array.prototype.toBase64 instanceof Function)) {
	Uint8Array.prototype.toBase64 = function toBase64({ alphabet = 'base64' } = {}) {
		if (alphabet === 'base64') {
			// @todo Figure out encoding specifics
			return btoa(String.fromCodePoint(...this));
			// return btoa(new TextDecoder().decode(this));
		} else if (alphabet === 'base64url') {
			return this.toBase64({ alphabet: 'base64' }).replaceAll('+', '-').replaceAll('/', '_');
		} else {
			throw new TypeError('expected alphabet to be either "base64" or "base64url');
		}
	};
}

if (! (Uint8Array.fromHex instanceof Function)) {
	Uint8Array.fromHex = function fromHex(str) {
		if (typeof str !== 'string') {
			throw new TypeError('expected input to be a string');
		} else if (! (str.length & 1) === 0) {
			throw new SyntaxError('string should be an even number of characters');
		} else {
			return Uint8Array.from(
				globalThis.Iterator.range(0, str.length, { step: 2 }),
				i => parseInt(str.substring(i, i + 2), 16)
			);
		}
	};
}

if (! (Uint8Array.fromBase64 instanceof Function)) {
	Uint8Array.fromBase64 = function fromBase64(str, {
		alphabet = 'base64',
		lastChunkHandling = 'loose',
	} = {}) {
		if (typeof str !== 'string') {
			throw new TypeError('expected input to be a string');
		} else if (! ['base64', 'base64url'].includes(alphabet)) {
			throw new TypeError('expected alphabet to be either "base64" or "base64url');
		} else if (! ['loose', 'strict', 'stop-before-partial'].includes(lastChunkHandling)) {
			throw new TypeError(`Invalid \`lastChunkHandling\`: "${lastChunkHandling}".`);
		} else if (alphabet === 'base64') {
			const lastChunkLength = str.length % 4;

			if (lastChunkLength === 1) {
				throw new TypeError('Invalid string length.');
			} else if (lastChunkLength !== 0) {
				switch(lastChunkHandling) {
					case 'strict':
						throw new SyntaxError('Missing padding.');

					case 'loose':
						return Uint8Array.fromBase64(str.padEnd(str.length + (4 - lastChunkLength), '='), {
							alphabet: 'base64',
							lastChunkHandling: 'strict',
						});

					case 'stop-before-partial':
						return Uint8Array.fromBase64(str.slice(0, str.length - lastChunkLength), {
							alphabet: 'base64',
							lastChunkHandling: 'strict',
						});

					// Already checked for valid `lastChunkHandling`
				}
			} else {
				return new TextEncoder().encode(atob(str));
			}
		} else {
			return Uint8Array.fromBase64(
				str.replaceAll('-', '+').replaceAll('_', '/'),
				{ alphabet: 'base64', }
			);
		}
	};
}

// @todo Implement Uint8Array.fromBase64Into & Uint8Array.fromHexInto
// if (! (Uint8Array.fromBase64Into instanceof Function)) {
// 	Uint8Array.fromBase64Into = function fromBase64Into(str, target) {
// 		const { read, written } = new TextEncoder().encodeInto(atob(str), target);
// 		return { read, written, target };
// 	};
// }
