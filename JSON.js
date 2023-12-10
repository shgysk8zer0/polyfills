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
