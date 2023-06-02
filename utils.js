export function polyfillMethod(parent, name, value, {
	writable = true,
	enumerable = true,
	configurable = true,
} = {}) {
	if (! (parent[name] instanceof Function)) {
		Object.defineProperty(parent, name, { value, writable, enumerable, configurable });
	}
}
