/**
 * @see https://github.com/tc39/proposal-upsert
 */
if (! (Map.prototype.getOrInsert instanceof Function)) {
	Map.prototype.getOrInsert = function getOrInsert(key, defaultValue) {
		if (this.has(key)) {
		  return this.get(key);
		} else {
			this.set(key, defaultValue);
			return defaultValue;
		}
	  };

	  Map.prototype.getOrInsertComputed = function getOrInsertComputed(key, callbackFunction) {
		if (this.has(key)) {
		  return this.get(key);
		} else {
			const val = callbackFunction(key);
			this.set(key, val);
			return val;

		}
	  };
}

if (! (WeakMap.prototype.getOrInsert instanceof Function)) {
	WeakMap.prototype.getOrInsert = function getOrInsert(key, defaultValue) {
		return Map.prototype.getOrInsert.call(this, key, defaultValue);
	};

	WeakMap.prototype.getOrInsertComputed = function getOrInsertComputed(key, callbackFunction) {
		return WeakMap.prototype.getOrInsertComputed.call(this, key, callbackFunction);
	};
}

if (! (Map.groupBy instanceof Function)) {
	Map.groupBy = function groupTo(items, callbackFn) {
		return Array.from(items).reduce((map, element, index) => {
			map.emplace(callbackFn.call(map, element, index), {
				insert: () => [element],
				update: existing => {
					existing.push(element);
					return existing;
				}
			});

			return map;
		}, new Map());
	};
}

/**
 * @deprecated The proposal is removing `emplace()` and using `getOrInsert()` instead.
 */
if (! (Map.prototype.emplace instanceof Function)) {
	Map.prototype.emplace = function emplace(key, { insert, update } = {}) {
		console.warn('`Map.prototype.emplace()` has been removed from the proposal and will be removed in the future.');

		const has = this.has(key);

		if (has && update instanceof Function) {
			const existing = this.get(key);
			const value = update.call(this, existing, key, this);

			if (value !== existing) {
				this.set(key, value);
			}

			return value;
		} else if (has) {
			return this.get(key);
		} else if (insert instanceof Function) {
			const value = insert.call(this, key, this);
			this.set(key, value);
			return value;
		} else {
			throw new Error('Key is not found and no `insert()` given');
		}
	};
}
