if (! (globalThis.Tuple instanceof Function)) {
	/* eslint-disable no-inner-declarations */
	function Tuple(...items) {
		const result = Array.apply(Object.create(Tuple.prototype), items);
		Object.setPrototypeOf(result, Tuple.prototype);
		Object.freeze(result);
		return result;
	}

	// const notAllowed = ['push', 'pop', 'sort', 'reverse', 'splice', 'shift', 'unshift', 'constructor'];
	// Tuple.prototype.constructor = Tuple;

	Tuple.prototype.forEach = function forEach() {
		Array.prototype.forEach.apply(this, arguments);
	};

	Tuple.prototype.join = function join() {
		return Array.prototype.join.apply(this, arguments);
	};

	Tuple.prototype.indexOf = function indexOf() {
		return Array.prototype.indexOf.apply(this, arguments);
	};

	Tuple.prototype.lastIndexOf = function lastIndexOf() {
		return Array.prototype.lastIndexOf.apply(this, arguments);
	};

	Tuple.prototype.findIndex = function findIndex() {
		return Array.prototype.findIndex.apply(this, arguments);
	};

	Tuple.prototype.find = function find() {
		return Array.prototype.find.apply(this, arguments);
	};

	Tuple.prototype.findLast = function findLast() {
		return Array.prototype.findLast.apply(this, arguments);
	};

	Tuple.prototype.findLastIndex = function findLastIndex() {
		return Array.prototype.findLastIndex.apply(this, arguments);
	};

	Tuple.prototype.every = function every() {
		return Array.prototype.every.apply(this, arguments);
	};

	Tuple.prototype.some = function some() {
		return Array.prototype.some.apply(this, arguments);
	};

	Tuple.prototype.includes = function includes() {
		return Array.prototype.includes.apply(this, arguments);
	};

	Tuple.prototype.map = function map() {
		return Tuple.from(Array.prototype.map.apply(this, arguments));
	};

	Tuple.prototype.filter = function filter() {
		return Tuple.from(Array.prototype.filter.apply(this, arguments));
	};

	Tuple.prototype.flat = function flat() {
		return Tuple.from(Array.prototype.flat.apply(this, arguments));
	};

	Tuple.prototype.flatMap = function flatMap() {
		return Tuple.from(Array.prototype.flatMap.apply(this, arguments));
	};

	Tuple.prototype.at = function at() {
		return Array.prototype.at.apply(this, arguments);
	};

	Tuple.prototype.reduce = function reduce() {
		return Tuple.from(Array.prototype.reduce.apply(this, arguments));
	};

	Tuple.prototype.reduceRight = function reduceRight() {
		return Tuple.from(Array.prototype.reduceRight.apply(this, arguments));
	};

	Tuple.prototype.toSorted = function toSorted() {
		return Tuple.from(Array.prototype.toSorted.apply(this, arguments));
	};

	Tuple.prototype.toSpliced = function toSpliced() {
		return Tuple.from(Array.prototype.toSpliced.apply(this, arguments));
	};

	Tuple.prototype.toReversed = function toReversed() {
		return Tuple.from(Array.prototype.toReversed.apply(this, arguments));
	};

	Tuple.prototype.toJSON = function toJSON() {
		return [...this];
	};

	Tuple.prototype.keys = function keys(){
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

	Tuple.from = function from(items) {
		return Tuple(...items);
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
		}
	});

	globalThis.Tuple = Tuple;
}
