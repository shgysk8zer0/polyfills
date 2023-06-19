export function polyfillMethod(parent, name, value, {
	writable = true,
	enumerable = true,
	configurable = true,
} = {}) {
	if (! (parent[name] instanceof Function)) {
		Object.defineProperty(parent, name, { value, writable, enumerable, configurable });
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
	}
}

export function overwriteMethod(parent, name, func) {
	const { value,  enumerable, configurable, writable } = Object.getOwnPropertyDescriptor(parent, name);
	const newMethod = func(value);

	if (! (newMethod instanceof Function)) {
		throw new TypeError(`Error overwriting ${name}. The func MUST be a function that accepts the original as an argument and return a function.`);
	} else {
		Object.defineProperty(parent, name, { value: newMethod,  enumerable, configurable, writable });
	}
}
