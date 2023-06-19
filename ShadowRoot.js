import { polyfillGetterSetter } from './utils.js';
import { adoptedStyleSheets } from './assets/adoptedStylesheets.js';

if ('ShadowRoot' in globalThis) {
	polyfillGetterSetter(ShadowRoot.prototype, 'adoptedStyleSheets', adoptedStyleSheets);
}
