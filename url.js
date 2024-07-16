import { polyfillMethod } from './utils.js';

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
