import { markPolyfilled } from './utils.js';

if (! (globalThis.Tuple instanceof Function)) {
	/* eslint-disable no-inner-declarations */

	/**
	 * Creates an unfrozen Tuple, such as for `Tuple.of()`
	 */
	const createTuple = items => {
		const tuple = Array.apply(Object.create(Tuple.prototype), items);
		Object.setPrototypeOf(tuple, Tuple.prototype);
		return tuple;
	};

	function Tuple(...items) {
		if (new.target === Tuple) {
			throw new TypeError('Tuple is not a constructor');
		}

		const tuple = createTuple(items);
		Object.freeze(tuple);
		return tuple;
	}

	Tuple.prototype.forEach = function forEach(callbackFn, thisArg) {
		Array.prototype.forEach.call(this, callbackFn, thisArg);
	};

	Tuple.prototype.join = function join(separator = ',') {
		return Array.prototype.join.call(this, separator);
	};

	Tuple.prototype.concat = function concat(...values) {
		return Tuple(...this, ...values);
	};

	Tuple.prototype.slice = function slice(start, end) {
		return Tuple.from(Array.prototype.slice.call(this, start, end));
	};

	Tuple.prototype.indexOf = function indexOf(searchElement, fromIndex) {
		return Array.prototype.indexOf.call(this, searchElement, fromIndex);
	};

	Tuple.prototype.lastIndexOf = function lastIndexOf(searchElement, fromIndex) {
		return Array.prototype.lastIndexOf.call(this, searchElement, fromIndex);
	};

	Tuple.prototype.findIndex = function findIndex(callbackFn, thisArg) {
		return Array.prototype.findIndex.call(this, callbackFn, thisArg);
	};

	Tuple.prototype.find = function find(callbackFn, thisArg) {
		return Array.prototype.find.call(this, callbackFn, thisArg);
	};

	Tuple.prototype.findLast = function findLast(callbackFn, thisArg) {
		return Array.prototype.findLast.call(this, callbackFn, thisArg);
	};

	Tuple.prototype.findLastIndex = function findLastIndex(callbackFn, thisArg) {
		return Array.prototype.findLastIndex.call(this, callbackFn, thisArg);
	};

	Tuple.prototype.every = function every(callbackFn, thisArg) {
		return Array.prototype.every.call(this, callbackFn, thisArg);
	};

	Tuple.prototype.some = function some(callbackFn, thisArg) {
		return Array.prototype.some.call(this, callbackFn, thisArg);
	};

	Tuple.prototype.includes = function includes(searchElement, fromIndex) {
		return Array.prototype.includes.call(this, searchElement, fromIndex);
	};

	Tuple.prototype.map = function map(callbackFn, thisArg) {
		return Tuple.from(Array.prototype.map.call(this, callbackFn, thisArg));
	};

	Tuple.prototype.filter = function filter(callbackFn, thisArg) {
		return Tuple.from(Array.prototype.filter.call(this, callbackFn, thisArg));
	};

	Tuple.prototype.flat = function flat(depth) {
		return Tuple.from(Array.prototype.flat.call(this, depth));
	};

	Tuple.prototype.flatMap = function flatMap(callbackFn, thisArg) {
		return Tuple.from(Array.prototype.flatMap.call(this, callbackFn, thisArg));
	};

	Tuple.prototype.at = function at(index) {
		return Array.prototype.at.call(this, index);
	};

	Tuple.prototype.reduce = function reduce(callbackFn, initialValue) {
		return Tuple.from(Array.prototype.reduce.call(this, callbackFn, initialValue));
	};

	Tuple.prototype.reduceRight = function reduceRight(callbackFn, initialValue) {
		return Tuple.from(Array.prototype.reduceRight.call(this, callbackFn, initialValue));
	};

	Tuple.prototype.toSorted = function toSorted(toStringTag) {
		return Tuple.from(Array.prototype.toSorted.call(this, toStringTag));
	};

	Tuple.prototype.toSpliced = function toSpliced(start, deleteCount, ...items) {
		return Tuple.from(Array.prototype.toSpliced.call(this, start, deleteCount, ...items));
	};

	Tuple.prototype.toReversed = function toReversed() {
		return Tuple.from(Array.prototype.toReversed.apply(this));
	};

	Tuple.prototype.with = function(index, value) {
		return Tuple.from(Array.prototype.with.call(this, index, value));
	};

	Tuple.prototype.toLocaleString = function toLocaleString(locales, options) {
		return Array.prototype.toLocaleString.call(this, locales, options);
	};

	Tuple.prototype.toJSON = function toJSON() {
		return [...this];
	};

	Tuple.prototype.keys = function keys() {
		return Array.prototype.keys.apply(this);
	};

	Tuple.prototype.values = function values(){
		return Array.prototype.values.apply(this);
	};

	Tuple.prototype.entries = function entries(){
		return Array.prototype.entries.apply(this);
	};

	Tuple.prototype[Symbol.iterator] = function() {
		return Array.prototype[Symbol.iterator].apply(this);
	};

	Tuple.from = function from(items, mapFn, thisArg) {
		const tuple = createTuple([]);
		Array.prototype.push.apply(tuple, Array.from(items, mapFn, thisArg));
		Object.freeze(tuple);
		return tuple;
	};

	Tuple.of = function(...items) {
		return Tuple.from(items);
	};

	Object.defineProperties(Tuple.prototype, {
		'length': {
			get: function() {
				return Object.getOwnPropertyDescriptor(Array.prototype, 'length').get.apply(this);
			},
			enumerable: true,
			configurable: false,
		},
		'lastItem': {
			get: function() {
				return this[this.lastIndex];
			},
			enumerable: true,
			configurable: false,
		},
		'lastIndex': {
			get: function() {
				return Object.getOwnPropertyDescriptor(Array.prototype, 'lastIndex').get.apply(this);
			},
			enumerable: true,
			configurable: false,
		},
		[Symbol.toStringTag]: {
			value: 'Tuple',
			enumerable: true,
			configurable: false,
			writable: false,
		},
	});

	globalThis.Tuple = Tuple;
	markPolyfilled(globalThis, 'Tuple');
}
