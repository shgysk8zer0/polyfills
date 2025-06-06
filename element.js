import { aria } from './aom.js';
import { polyfillGetterSetter, polyfillMethod, overwriteMethod } from './utils.js';
import { getHTML, setHTMLUnsafe } from './methods/dom.js';
import './sanitizer.js';

polyfillMethod(Element.prototype, 'setHTMLUnsafe', setHTMLUnsafe);
polyfillMethod(Element.prototype, 'getHTML', getHTML);

if ('CustomElementRegistry' in globalThis && ! (CustomElementRegistry.prototype.getName instanceof Function)) {
	const registry = new Map();

	overwriteMethod(CustomElementRegistry.prototype, 'define', original => {
		return (tag, proto, opts) => {
			original.call(customElements, tag,proto, opts);
			registry.set(proto, typeof opts.extends === 'string' ? opts.extends : tag);
		};
	});

	polyfillMethod(CustomElementRegistry.prototype, 'getName', proto => {
		if (typeof proto === 'function') {
			return registry.get(proto) ?? null;
		} else if (typeof proto === 'object' && proto !== null) {
			// Unnecessary, but just to be sure the same errors are thrown.
			throw new TypeError('CustomElementRegistry.getName: Argument 1 is not callable.');
		} else {
			throw new TypeError('CustomElementRegistry.getName: Argument 1 is not an object.');
		}
	});
}

function handlePopover({ currentTarget }) {
	switch(currentTarget.popoverTargetAction) {
		case 'show':
			currentTarget.popoverTargetElement.showPopover();
			break;

		case 'hide':
			currentTarget.popoverTargetElement.hidePopover();
			break;

		default:
			currentTarget.popoverTargetElement.togglePopover();
	}
}

export function initPopover(target = document.body) {
	target.querySelectorAll('button[popovertarget], input[type="button"][popovertarget]')
		.forEach(el => el.addEventListener('click', handlePopover));
}

if (! (globalThis.ToggleEvent instanceof Function)) {
	class ToggleEvent extends Event {
		#newState;
		#oldState;

		constructor(type, { newState, oldState }) {
			super(type, { bubbles: true });
			this.#newState = newState;
			this.#oldState = oldState;
		}

		get newState() {
			return this.#newState;
		}

		get oldState() {
			return this.#oldState;
		}
	}

	globalThis.ToggleEvent = ToggleEvent;
}

if (! (HTMLElement.prototype.showPopover instanceof Function)) {
	const isPopoverOpen = el => el.classList.contains('_popover-open');

	Object.defineProperties(HTMLElement.prototype, {
		showPopover: {
			value: function showPopover() {
				if (! isPopoverOpen(this)) {
					this.dispatchEvent(new ToggleEvent('beforetoggle', { oldState: 'closed', newState: 'open' }));

					if (this.getAttribute('popover') === 'auto') {
						const controller = new AbortController();

						document.body.addEventListener('click', ({ target }) => {
							if (! this.contains(target) && ! this.isSameNode(target.popoverTargetElement)) {
								controller.abort();
								this.hidePopover();
							}
						}, { signal: controller.signal,  capture: true });

						document.body.addEventListener('keydown', ({ key }) => {
							if (key === 'Escape') {
								controller.abort();
								this.hidePopover();
							}
						}, { signal: controller.signal, capture: true });

						document.addEventListener('beforetoggle', ({ target }) => {
							if (! target.isSameNode(this) && target.getAttribute('popover') === 'auto') {
								controller.abort();
								this.hidePopover();
							}
						}, { signal: controller.signal });
					}

					this.classList.add('_popover-open');
					this.dispatchEvent(new ToggleEvent('toggle', { oldState: 'closed', newState: 'open' }));
				}
			}
		},
		hidePopover: {
			value: function hidePopover() {
				if (isPopoverOpen(this)) {
					this.dispatchEvent(new ToggleEvent('beforetoggle', { oldState: 'open', newState: 'closed' }));
					queueMicrotask(() => this.classList.remove('_popover-open'));
					this.dispatchEvent(new ToggleEvent('toggle', { oldState: 'open', newState: 'closed' }));
				}
			}
		},
		togglePopover: {
			value: function togglePopover() {
				isPopoverOpen(this) ? this.hidePopover() : this.showPopover();
			}
		}
	});

	Object.defineProperties(HTMLButtonElement.prototype, {
		popoverTargetElement: {
			get() {
				return document.getElementById(this.getAttribute('popovertarget'));
			}
		},
		popoverTargetAction: {
			get() {
				return this.getAttribute('popovertargetaction') || 'toggle';
			},
			set(val) {
				this.setAttribute('popovertargetaction', val);
			}
		}
	});

	initPopover();
}

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

if (! HTMLTemplateElement.prototype.hasOwnProperty('shadowRootMode')) {
	const attachedShadows = new WeakMap();

	polyfillGetterSetter(HTMLTemplateElement.prototype, 'shadowRootMode', {
		get() {
			return this.getAttribute('shadowrootmode');
		},
		set(val) {
			this.setAttribute('shadowrootmode', val);
		}
	});

	polyfillGetterSetter(HTMLTemplateElement.prototype, 'shadowRootDelegatesFocus', {
		get() {
			return this.hasAttribute('shadowrootdelegatesfocus');
		},
		set(val) {
			this.toggleAttribute('shadowrootdelegatesfocus', val);
		}
	});

	polyfillGetterSetter(HTMLTemplateElement.prototype, 'shadowRootClonable', {
		get() {
			return this.hasAttribute('shadowrootclonable');
		},
		set(val) {
			this.toggleAttribute('shadowrootclonable', val);
		}
	});

	polyfillGetterSetter(HTMLTemplateElement.prototype, 'shadowRootSerializable', {
		get() {
			return this.hasAttribute('shadowrootserializable');
		},
		set(val) {
			this.toggleAttribute('shadowrootserializable', val);
		}
	});

	const attachShadows = (base = document) => {
		base.querySelectorAll('template[shadowrootmode]').forEach(tmp => {
			const shadow = tmp.parentElement.attachShadow({
				mode: tmp.shadowRootMode,
				clonable: tmp.shadowRootClonable,
				delegatesFocus: tmp.shadowRootDelegatesFocus,
				serializable: tmp.shadowRootSerializable,
			});

			shadow.append(tmp.content);
			tmp.remove();
			attachShadows(shadow);
			attachedShadows.set(shadow.host, shadow);
		});
	};

	overwriteMethod(HTMLElement.prototype, 'attachShadow', function(attach) {
		return ({ mode, clonable = false, delegatesFocus = false, serializable = false, slotAssignment = 'auto' }) => {
			if (! attachedShadows.has(this)) {
				return attach.call(this, { mode, clonable, delegatesFocus, serializable, slotAssignment });
			} else {
				const shadow = attachedShadows.get(this);

				if (mode === shadow.shadowRootMode) {
					attachShadows.remove(this);
					return shadow;
				} else {
					throw new DOMException('Element.attachShadow: Unable to re-attach to existing ShadowDOM');
				}
			}
		};
	});

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

if ('HTMLDialogElement' in globalThis && ! (HTMLDialogElement.prototype.requestClose instanceof Function)) {
	HTMLDialogElement.prototype.requestClose = function requestClose(returnValue) {
		const event = new Event('cancel', { cancelable: true, bubbles: false });
		this.dispatchEvent(event);

		if (! event.defaultPrevented) {
			this.close(returnValue);
		}
	};
}
