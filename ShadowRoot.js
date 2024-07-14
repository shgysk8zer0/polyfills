import { polyfillGetterSetter, polyfillMethod } from './utils.js';
import { adoptedStyleSheets } from './assets/adoptedStylesheets.js';
import { setHTMLUnsafe } from './methods/dom.js';

if ('ShadowRoot' in globalThis) {
	polyfillGetterSetter(ShadowRoot.prototype, 'adoptedStyleSheets', adoptedStyleSheets);
	polyfillMethod(ShadowRoot.prototype,  'setHTMLUnsafe', setHTMLUnsafe);

	polyfillMethod(ShadowRoot.prototype, 'getHTML', function ({ shadowRoots, serializableShadowRoots  = false } = {}) {
		const clone = this.cloneNode(true);

		if (serializableShadowRoots) {
			//
		}

		if  (Array.isArray(shadowRoots)) {
			//
		}

		return clone.innerHTML;
	});

}
