import { polyfillMethod } from './utils.js';

polyfillMethod(URL, 'canParse', (str, base) => {
	try {
		new URL(str, base);
		return true;
	} catch {
		return false;
	}
});
