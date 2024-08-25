import { polyfillMethod } from './utils.js';
import URLPattern from './assets/url-pattern.js';

if (! ('URLPattern' in globalThis)) {
	globalThis.URLPattern = URLPattern;
}

polyfillMethod(URL, 'parse', (url, base) => {
	try {
		return new URL(url, base);
	} catch {
		return null;
	}
});

polyfillMethod(URL, 'canParse', (url, base) => {
	try {
		return new URL(url, base) instanceof URL;
	} catch {
		return false;
	}
});
