import { polyfillGetterSetter, polyfillMethod } from './utils.js';
import { adoptedStyleSheets } from './assets/adoptedStylesheets.js';
import { getHTML, setHTMLUnsafe } from './methods/dom.js';

if ('ShadowRoot' in globalThis) {
	polyfillGetterSetter(ShadowRoot.prototype, 'adoptedStyleSheets', adoptedStyleSheets);
	polyfillMethod(ShadowRoot.prototype,  'setHTMLUnsafe', setHTMLUnsafe);
	polyfillMethod(ShadowRoot.prototype, 'getHTML', getHTML);
}
