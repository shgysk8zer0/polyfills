import { aria } from './aom.js';
import { overwriteMethod, polyfillGetterSetter } from './utils.js';
import { SanitizerConfig as defaultConfig } from './assets/SanitizerConfigW3C.js';
import { setHTML as safeSetHTML, convertToSanitizerConfig } from './assets/sanitizerUtils.js';

if (! (HTMLScriptElement.supports instanceof Function)) {
	HTMLScriptElement.supports = function supports(type) {
		switch(type.toLowerCase()) {
			case 'classic':
				return true;

			case 'module':
				return 'noModule' in HTMLScriptElement.prototype;

			case 'importmap':
				return false;

			case 'speculationrules':
				return false;

			default:
				return false;
		}
	};
}

if (! Element.prototype.hasOwnProperty(aria.role)) {
	const enumerable = true;
	const configurable = true;

	const props = Object.fromEntries(Object.entries(aria).map(([prop, attr]) => [prop, {
		get: function() {
			return this.getAttribute(attr);
		},
		set: function(val) {
			if (typeof val === 'string') {
				this.setAttribute(attr, val);
			} else {
				this.removeAttribute(attr);
			}
		},
		enumerable, configurable,
	}]));

	Object.defineProperties(Element.prototype, props);
}

if (! HTMLElement.prototype.hasOwnProperty('inert')) {
	// CSS will handle pointer events
	const previous = new WeakMap();
	const restoreTabIndex = el => {
		if (previous.has(el)) {
			el.tabIndex = previous.get(el);
		}

		if (el.hasChildNodes()) {
			[...el.children].forEach(restoreTabIndex);
		}
	};

	const setTabIndex = el => {
		if (el.tabIndex !== -1) {
			previous.set(el, el.tabIndex);
			el.tabIndex = -1;
		}

		if (el.hasChildNodes()) {
			[...el.children].forEach(setTabIndex);
		}
	};

	Object.defineProperty(HTMLElement.prototype, 'inert', {
		get: function() {
			return this.hasAttribute('inert');
		},
		set: function(val) {
			if (val) {
				this.setAttribute('aria-hidden', 'true');
				this.setAttribute('inert', '');
				setTabIndex(this);
			} else {
				this.removeAttribute('aria-hidden');
				this.removeAttribute('inert');
				restoreTabIndex(this);
			}
		},
		enumerable: true, configurable: true,
	});
}

if (! HTMLImageElement.prototype.hasOwnProperty('complete')) {
	/**
	 * Note: This shim cannot detect if an image has an error while loading
	 * and will return false on an invalid URL, for example. It also does not
	 * work for 0-sized images, if such a thing is possible.
	 */
	Object.defineProperty(HTMLImageElement.prototype, 'complete', {
		get: function() {
			return this.src === '' || this.naturalHeight > 0;
		}
	});
}

if (! (HTMLImageElement.prototype.decode instanceof Function)) {
	HTMLImageElement.prototype.decode = function () {
		if (this.complete) {
			return Promise.resolve();
		} else {
			return new Promise((resolve, reject) => {
				const load = () => {
					this.removeEventListener('error', error);
					this.removeEventListener('load', load);
					resolve();
				};

				const error = (err) => {
					this.removeEventListener('error', error);
					this.removeEventListener('load', load);
					reject(err);
				};

				this.addEventListener('load', load);
				this.addEventListener('error', error);
			});
		}
	};
}

if (! (Element.prototype.setHTML instanceof Function)) {
	Element.prototype.setHTML = function setHTML(input, opts = defaultConfig) {
		safeSetHTML(this, input, opts);
	};
} else {
	overwriteMethod(Element.prototype, 'setHTML', function(orig) {
		return function setHTML(input, opts = {}) {
			if (! (opts.sanitizer instanceof Sanitizer)) {
				const sanitizer = new Sanitizer(convertToSanitizerConfig(opts));
				orig.call(this, input, { sanitizer });
			} else {
				orig.call(this, input, opts);
			}
		};
	});
}

if (! HTMLTemplateElement.prototype.hasOwnProperty('shadowRootMode')) {
	Object.defineProperty(HTMLTemplateElement.prototype, 'shadowRootMode', {
		get: function() {
			return this.getAttribute('shadowrootmode');
		},
		set: function(val) {
			this.setAttribute('shadowrootmode', val);
		},
		enumerable: true,
		configurable: true,
	});

	const attachShadows = (base = document) => {
		base.querySelectorAll('template[shadowrootmode]').forEach(tmp => {
			const shadow = tmp.parentElement.attachShadow({ mode: tmp.shadowRootMode });
			shadow.append(tmp.content);
			tmp.remove();
			attachShadows(shadow);
		});
	};

	if (document.readyState === 'loading') {
		document.addEventListener('readystatechange', () => attachShadows(document), { once: true });
	} else {
		attachShadows(document);
	}
}

if (! (HTMLFormElement.prototype.requestSubmit instanceof Function)) {
	HTMLFormElement.prototype.requestSubmit = function(submitter) {
		if (typeof submitter === 'undefined') {
			const btn = document.createElement('button');
			btn.type = 'submit';
			btn.hidden = true;
			this.append(btn);
			this.requestSubmit(btn);
			setTimeout(() => btn.remove(), 100);
		} else if (! (submitter instanceof HTMLButtonElement || submitter instanceof HTMLInputElement)) {
			throw new TypeError('HTMLFormElement.requestSubmit: The submitter is not a submit button.');
		} else if (submitter.type !== 'submit' && ! (submitter instanceof HTMLInputElement && submitter.type === 'image')) {
			throw new TypeError('HTMLFormElement.requestSubmit: The submitter is not a submit button.');
		} else if (! this.isSameNode(submitter.form)) {
			throw new DOMException('HTMLFormElement.requestSubmit: The submitter is not owned by this form.', 'NotFoundError');
		} else {
			submitter.click();
		}
	};
}

if (! ('loading' in HTMLIFrameElement.prototype)) {
	polyfillGetterSetter(HTMLIFrameElement.prototype, 'loading', {
		get: function() {
			return this.getAttribute('loading') || 'auto';
		},
		set: function(val) {
			this.setAttribute('loading', val);
		}
	});
}

if (! ('credentialless' in HTMLIFrameElement.prototype)) {
	polyfillGetterSetter(HTMLIFrameElement.prototype, 'credentialless', {
		get: function() {
			return this.hasAttribute('credentialless');
		},
		set: function(val) {
			this.toggleAttribute('credentialless', val);
		}
	});
}
