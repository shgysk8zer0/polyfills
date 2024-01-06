if (! ('Set' in globalThis)) {
	globalThis.Set = class Set {
		#items = [];

		constructor(items) {
			Array.from(items).forEach(item => this.add(item));
		}

		[Symbol.iterator]() {
			return this.#items.values();
		}

		get [Symbol.toStringTag]() {
			return 'Set';
		}

		get size() {
			return this.#items.length;
		}

		add(item) {
			if (! this.has(item)){
				this.#items.push(item);
			}

			return this;
		}

		delete(item) {
			const index = this.#items.indexOf(item);

			if (index !== -1) {
				this.#items = this.#items.slice(0, index).concat(this.#items.slice(index + 1));
				return true;
			} else {
				return false;
			}
		}

		has(item) {
			return this.#items.includes(item);
		}

		clear() {
			this.#items = [];
		}

		keys() {
			return this[Symbol.iterator]();
		}

		values() {
			return this[Symbol.iterator]();
		}

		entries() {
			return this.keys().map(item => [item, item]);
		}

		forEach(callbackFn, thisArg) {
			if (typeof thisArg === 'undefined') {
				for (const value of this) {
					callbackFn.call(this, value, value, this);
				}
			} else {
				for (const value of this) {
					callbackFn.call(thisArg, value, value, this);
				}
			}
		}
	};
}
