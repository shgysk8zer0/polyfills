if (! (globalThis.Record instanceof Function)) {
	/* eslint-disable no-inner-declarations */
	function Record(obj) {
		if (new.target === Record) {
			throw new TypeError('Record is not a constructor');
		}

		const record = Object.create(Record.prototype);
		Object.defineProperties(record, Object.fromEntries(Object.entries(obj).map(([key, value]) => [
			key, {
				'enumerable': true,
				'configurable': false,
				'writable': false,
				'value': value,
			}
		])));

		Object.freeze(record);
		return record;
	}

	Record.prototype.constructor  = Record;
	Object.defineProperty(Record.prototype, Symbol.toStringTag, {
		value: 'Record',
		enumerable: true,
		configurable: false,
		writable: false,
	});

	Record.fromEntries = function fromEntries(entries) {
		return Record(Object.fromEntries(entries));
	};

	globalThis.Record = Record;
}
