/**
 * @see https://github.com/tc39/proposal-iterator-helpers
 */

const supported = 'Iterator' in globalThis;

const IteratorPrototype = supported
	? Object.getPrototypeOf(globalThis.Iterator)
	: Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]()));

const Iterator = supported
	? globalThis.Iterator
	: (proto => {
		class Iterator {
			[Symbol.iterator]() {
				return this;
			}
		}

		Object.setPrototypeOf(Iterator, proto);

		return Iterator;
	})(IteratorPrototype);

if (! (Iterator.range instanceof Function)) {
	Iterator.range = function range(start, end, option) {
		if (typeof option === 'number' || typeof option === 'bigint') {
			return Iterator.range(start, end, { step: option });
		} else if (typeof option !== 'object' || Object.is(option, null)) {
			return Iterator.range(start, end, {});
		} else {
			const {
				// Default to +/-, Number/BigInt based on start & end
				step = typeof start === 'number'
					? start < end ? 1 : -1
					: start < end ? 1n : -1n,
				inclusive = false,
			} = option;

			if (typeof start !== 'number' && typeof start !== 'bigint') {
				throw new TypeError('Start must be a number');
			} else if (Number.isNaN(start)) {
				throw new RangeError('Invalid start');
			} else if (typeof end !== 'number' && typeof end !== 'bigint') {
				throw new TypeError('End must be a number');
			} else if (Number.isNaN(end)) {
				throw new RangeError('Invalid end');
			} else if (typeof step !== 'number' && typeof step !== 'bigint') {
				throw new TypeError('Step must be a number');
			} else if (Number.isNaN(step)) {
				throw new RangeError('Invalid step');
			} else if (step === 0) {
				throw new RangeError('Step must not be 0');
			} else if ((step < 0 && start < end) || (step > 0 && start > end)) {
				return;
			} else if (inclusive) {
				let n = start;
				if (step > 0) {
					return Iterator.from({
						next() {
							const ret = n <= end ? { value: n, done: false } : { done: true };
							n+= step;
							return ret;
						}
					});
				} else {
					return Iterator.from({
						next() {
							const ret = n >= end ? { value: n, done: false } : { done: true };
							n+= step;
							return ret;
						}
					});
				}
			} else {
				let n = start;

				if (step > 0) {
					return Iterator.from({
						next() {
							const ret = n < end ? { value: n, done: false } : { done: true };
							n+= step;
							return ret;
						}
					});
				} else {
					let n = start;

					return Iterator.from({
						next() {
							const ret = n > end ? { value: n, done: false } : { done: true };
							n+= step;
							return ret;
						}
					});
				}
			}
		}
	};
}

if (! (IteratorPrototype[Symbol.toStringTag])) {
	IteratorPrototype[Symbol.toStringTag] = 'Iterator';
}

if (! (IteratorPrototype.take instanceof Function)) {
	IteratorPrototype.take = function take(limit) {
		let n = 0;
		const iter = this;

		return Iterator.from({
			next() {
				if (n++ >= limit) {
					return { done: true };
				} else {
					return iter.next();
				}
			}
		});
	};
}

if (! (IteratorPrototype.drop instanceof Function)) {
	IteratorPrototype.drop = function drop(limit) {
		for (let n = 0; n < limit; n++) {
			const { done } = this.next();

			if (done) {
				break;
			}
		}

		return this;
	};
}

if (! (IteratorPrototype.toArray instanceof Function)) {
	IteratorPrototype.toArray = function toArray() {
		return Array.from(this);
	};
}

if (! (IteratorPrototype.forEach instanceof Function)) {
	IteratorPrototype.forEach = function forEach(callback) {
		for (const item of this) {
			callback.call(this, item);
		}
	};
}

if (! (IteratorPrototype.flatMap instanceof Function)) {
	IteratorPrototype.flatMap = function flatMap(mapper) {
		const iter = this;
		let cur = this.next();

		const getSubIter = ({ value, done = true } = {}) => {
			return done
				? Iterator.from({
					next() {
						return { done: true };
					}
				})
				: Iterator.from(mapper.call(iter, value));
		};

		let sub = getSubIter(cur);

		return Iterator.from({
			next() {
				const { value, done = true } = sub.next();

				if (cur.done && done) {
					return { done: true };
				} else if (! done) {
					return { value, done };
				} else if (! cur.done) {
					cur = iter.next();
					sub = getSubIter(cur);
					return sub.next();
				} else {
					return { done: true };
				}
			}
		});

	};
}

if (! (IteratorPrototype.map instanceof Function)) {
	IteratorPrototype.map = function map(callback) {
		const iter = this;

		return Iterator.from({
			next() {
				const { done, value } = iter.next();

				if (done) {
					return { done };
				} else {
					return { value: callback.call(iter, value), done: false };
				}
			}
		});
	};
}

if (! (IteratorPrototype.reduce instanceof Function)) {
	IteratorPrototype.reduce = function reduce(callback, initialValue) {
		let current = typeof initialValue === 'undefined' ? this.next().value : initialValue;

		for (const item of this) {
			current = callback.call(this, current, item);
		}

		return current;
	};
}

if (! (IteratorPrototype.filter instanceof Function)) {
	IteratorPrototype.filter = function filter(callback) {
		const iter = this;
		let done = false;
		let value = undefined;

		return Iterator.from({
			next() {
				while (! done) {
					const cur = iter.next();
					done = cur.done;

					if (done) {
						break;
					} else if (callback.call(iter, cur.value)) {
						value = cur.value;
						break;
					}
				}

				return { done, value };
			}
		});
	};
}

if (! (IteratorPrototype.some instanceof Function)) {
	IteratorPrototype.some = function some(callback) {
		let retVal = false;
		for (const item of this) {
			if (callback.call(this, item)) {
				retVal = true;
				break;
			}
		}

		return retVal;
	};
}

if (! (IteratorPrototype.every instanceof Function)) {
	IteratorPrototype.every = function every(callback) {
		let retVal = true;
		for (const item of this) {
			if (! callback.call(this, item)) {
				retVal = false;
				break;
			}
		}

		return retVal;
	};
}

if (! (IteratorPrototype.find instanceof Function)) {
	IteratorPrototype.find = function find(callback) {
		for (const item of this) {
			if (callback.call(this, item)) {
				return item;
			}
		}
	};
}

if (! (IteratorPrototype.indexed instanceof Function)) {
	IteratorPrototype.indexed = function indexed() {
		let n = 0;
		return this.map(item => [n++, item]);
	};
}

if (! (Iterator.from instanceof Function)) {
	Iterator.from = function from(obj) {
		if (typeof obj !== 'object' || obj === null) {
			throw new TypeError('Not an object.');
		} else if (obj.next instanceof Function) {
			const iter = Object.create(IteratorPrototype, {
				'next': {
					enumerable: true,
					configurable: false,
					writable: false,
					value: (...args) => obj.next(...args),
				},
			});

			return iter;
		} else if(obj[Symbol.iterator] instanceof Function) {
			return Iterator.from(obj[Symbol.iterator]());
		}
	};
}

if (! supported) {
	globalThis.Iterator = Iterator;
}
