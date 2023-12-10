if (! (globalThis.Record instanceof Function)) {
	/* eslint-disable no-inner-declarations */
	function Record(obj) {
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

	Record.prototype = { constructor: Record };

	Record.fromEntries = function fromEntries(entries) {
		return new Record(Object.fromEntries(entries));
	};

	globalThis.Record = Record;
}
