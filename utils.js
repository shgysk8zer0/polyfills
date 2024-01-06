export const key = Symbol.for('_polyfilled');

export function markPolyfilled(thing, name) {
	try {
		if (thing.hasOwnProperty(key)) {
			thing[key].push(name);
			return true;
		} else {
			Object.defineProperty(thing, key, {
				value: [name],
				enumerable: false,
				configurable: false,
				writable: false,
			});

			return true;
		}
	} catch(err) {
		console.warn(err);
		return false;
	}
}

export function isPolyfilled(thing, name) {
	return thing.hasOwnProperty(key) && thing[key].includes(name);
}

export function polyfillMethod(parent, name, value, {
	writable = true,
	enumerable = true,
	configurable = true,
} = {}) {
	if (! (parent[name] instanceof Function)) {
		Object.defineProperty(parent, name, { value, writable, enumerable, configurable });
		markPolyfilled(parent, name);
		return true;
	} else {
		return false;
	}
}

export function polyfillGetterSetter(parent, name, {
	get,
	set,
	enumerable = true,
	configurable = true,
} = {}) {
	if (! parent.hasOwnProperty(name)) {
		Object.defineProperty(parent, name, { get, set, enumerable, configurable });
		markPolyfilled(parent, name);
	}
}

export function overwriteMethod(parent, name, func) {
	const { value,  enumerable, configurable, writable } = Object.getOwnPropertyDescriptor(parent, name);
	const newMethod = func(value);

	if (! (newMethod instanceof Function)) {
		throw new TypeError(`Error overwriting ${name}. The func MUST be a function that accepts the original as an argument and return a function.`);
	} else {
		Object.defineProperty(parent, name, { value: newMethod,  enumerable, configurable, writable });
		markPolyfilled(parent, name);
	}
}
