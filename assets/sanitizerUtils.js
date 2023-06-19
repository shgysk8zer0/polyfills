/**
 * @copyright 2023 Chris Zuber <admin@kernvalley.us>
 */
import { SanitizerConfig as defaultConfig } from './SanitizerConfigW3C.js';
import { createPolicy } from './trust.js';
import { isObject, getType, callOnce } from './utility.js';
import { urls } from './attributes.js';

export const supported = () => 'Sanitizer' in globalThis;
export const nativeSupport = supported();

export const setHTML = function setHTML(el, input, opts = defaultConfig) {
	const doc = safeParseHTML(input, opts);
	el.append(documentToFragment(doc));
};

const allowProtocols = ['https:'];

if (! allowProtocols.includes(location.protocol)) {
	allowProtocols.push(location.protocol);
}
const policyName = 'sanitizer-raw#html';
const getPolicy = callOnce(() => createPolicy(policyName, { createHTML: input => input }));
const createHTML = input => getPolicy().createHTML(input);

export function documentToFragment(doc) {
	const frag = document.createDocumentFragment();
	const clone = doc.cloneNode(true);
	frag.append(...clone.head.childNodes, ...clone.body.childNodes);
	return frag;
}

/**
 * Helper function to adapt to changes in spec
 */
export function convertSanitizerConfig({
	allowAttributes, allowComments, allowElements, allowCustomElements,
	blockElements, dropAttributes, dropElements, allowUnknownMarkup, sanitizer,
} = {}, context) {
	if (sanitizer instanceof Sanitizer) {
		return convertSanitizerConfig(sanitizer.getConfiguration(), context);
	} else {
		switch (context) {
			default:
				if (typeof allowAttributes === 'undefined' && typeof dropAttributes === 'undefined') {
					allowAttributes = defaultConfig.allowAttributes;
				}

				if (typeof allowElements === 'undefined' && typeof dropElements === 'undefined') {
					allowElements = defaultConfig.allowElements;
				}
				return {
					allowAttributes, allowComments, allowElements, allowCustomElements,
					blockElements, dropAttributes, dropElements, allowUnknownMarkup,
				};
		}
	}
}

export function convertToSanitizerConfig({
	allowAttributes, allowComments, allowElements, allowCustomElements,
	blockElements, dropAttributes, dropElements, allowUnknownMarkup,
} = {}) {
	if (typeof allowAttributes === 'undefined' && typeof dropAttributes === 'undefined') {
		allowAttributes = defaultConfig.allowAttributes;
	}

	if (typeof allowElements === 'undefined' && typeof dropElements === 'undefined') {
		allowElements = defaultConfig.allowElements;
	}
	return {
		allowAttributes, allowComments, allowElements, allowCustomElements,
		blockElements, dropAttributes, dropElements, allowUnknownMarkup,
	};
}

export function safeParseHTML(input, opts = defaultConfig) {
	const doc = new DOMParser().parseFromString(createHTML(input), 'text/html');
	// Not sure if this will be in spec, but it is necessary
	if (Array.isArray(opts.allowElements) && ! opts.allowElements.includes('html') ) {
		opts.allowElements = [...new Set([...opts.allowElements, 'html' ,'head', 'body'])];
	}
	return sanitizeNode(doc, opts);
}

export function sanitize(input, opts = defaultConfig) {
	if (! (input instanceof Node)) {
		throw new TypeError('sanitize requires a Document or DocumentFragment');
	} else if (input.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
		return sanitizeNode(input, opts);
	} else if (input.nodeType === Node.DOCUMENT_NODE) {
		return sanitizeNode(documentToFragment(input), opts);
	} else {
		throw new TypeError('sanitize requires a Document or DocumentFragment');
	}
}

export function sanitizeFor(tag, content, opts = defaultConfig) {
	const el = document.createElement(tag);
	const temp = document.createElement('template');
	temp.innerHTML = createHTML(content);
	el.append(sanitize(temp.content, opts));
	return el;
}

export function sanitizeNode(root, opts = defaultConfig) {
	try {
		if (! (root instanceof Node)) {
			throw new TypeError(`Expected a Node but got a ${getType(root)}.`);
		} else if (! isObject(opts)) {
			throw new TypeError(`Expected config to be an object but got ${getType(opts)}.`);
		}

		const {
			allowElements, allowComments, allowAttributes, allowCustomElements,
			blockElements, dropAttributes, dropElements, allowUnknownMarkup,
		} = convertSanitizerConfig(opts);

		const iter = document.createNodeIterator(
			root,
			NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT,
		);

		let node = iter.root.nodeType === Node.ELEMENT_NODE
			? iter.root
			: iter.nextNode();

		while (node instanceof Node) {
			switch(node.nodeType) {
				case Node.ELEMENT_NODE: {
					if (
						! allowUnknownMarkup
						&& ( ! (node instanceof HTMLElement) || node instanceof HTMLUnknownElement)
					) {
						node.remove();
						break;
					}

					const tag = node.tagName.toLowerCase();

					if (Array.isArray(dropElements) && dropElements.includes(tag)) {
						node.remove();
					} else if (Array.isArray(blockElements) && blockElements.includes(tag)) {
						if (node.hasChildNodes()) {
							node.replaceWith(...node.childNodes);
						} else {
							node.remove();
						}
					} else if (tag.includes('-') && ! allowCustomElements) {
						node.remove();
					} else if (Array.isArray(allowElements) && ! allowElements.includes(tag)) {
						node.remove();
					} else {
						if (node.hasAttributes()) {
							node.getAttributeNames().forEach(name => {
								const attr = node.getAttributeNode(name);
								const { value } = attr;

								if (
									urls.includes(name)
									&& ! allowProtocols.includes(new URL(value, document.baseURI).protocol)
								) {
									node.removeAttributeNode(attr);
								} else if (isObject(dropAttributes)) {
									if (
										name in dropAttributes
										&& ['*', tag].some(sel => dropAttributes[name].includes(sel))
									) {
										node.removeAttributeNode(attr);
									}
								} else if (isObject(allowAttributes)) {
									if (
										! (name in allowAttributes
										&& ['*', tag].some(sel => allowAttributes[name].includes(sel)))
									) {
										node.removeAttributeNode(attr);
									}
								}
							});
						}
					}

					break;
				}

				case Node.COMMENT_NODE: {
					if (! allowComments) {
						node.remove();
					}

					break;
				}
			}

			if (node.localName === 'template') {
				sanitizeNode(node.content, opts);
			}

			node = iter.nextNode();
		}

		return root;
	} catch(err) {
		console.error(err);
		root.parentElement.removeChild(root);
	}
}

export function getSantizerUtils(Sanitizer, defaultConfig) {
	const polyfill = function polyfill() {
		let polyfilled = false;

		if (! supported()) {
			globalThis.Sanitizer = Sanitizer;
			polyfilled = true;
		} else {
			if (! (globalThis.Sanitizer.getDefaultConfiguration instanceof Function)) {
				globalThis.Sanitizer.getDefaultConfiguration = function() {
					return defaultConfig;
				};
				polyfilled = true;
			}

			if (! (globalThis.Sanitizer.prototype.getConfiguration instanceof Function)) {
				const configs = new WeakMap();
				const SanitizerNative = globalThis.Sanitizer;

				globalThis.Sanitizer = class Sanitizer extends SanitizerNative {
					constructor({
						allowAttributes, allowComments, allowElements, allowCustomElements,
						blockElements, dropAttributes, dropElements, allowUnknownMarkup,
					} = SanitizerNative.getDefaultConfiguration()) {
						super({
							allowAttributes, allowComments, allowElements, allowCustomElements,
							blockElements, dropAttributes, dropElements, allowUnknownMarkup,
						});
						configs.set(this, {
							allowAttributes, allowComments, allowElements, allowCustomElements,
							blockElements, dropAttributes, dropElements, allowUnknownMarkup,
						});
					}

					getConfiguration() {
						return configs.get(this);
					}
				};
				polyfilled = true;
			}

			if (! (globalThis.Sanitizer.prototype.sanitize instanceof Function)) {
				globalThis.Sanitizer.prototype.sanitize = function(input) {
					if (! (input instanceof Node)) {
						throw new TypeError('`Sanitizer.sanitize()` expects a `Node`');
					} else if (! [Node.DOCUMENT_NODE, Node.DOCUMENT_FRAGMENT_NODE].includes(input.nodeType)) {
						throw new TypeError('Expected a Document or DocumentFragment in `Sanitizer.sanitize()`.');
					} else {
						return sanitize(input, this.getConfiguration());
					}
				};
				polyfilled = true;
			}

			if (! (globalThis.Sanitizer.prototype.sanitizeFor instanceof Function)) {
				globalThis.Sanitizer.prototype.sanitizeFor = function(element, input) {
					const el = document.createElement(element);
					setHTML(el, input,this.getConfiguration());
					return el;
				};
				polyfilled = true;
			}

			if (! (Element.prototype.setHTML instanceof Function)) {
				Element.prototype.setHTML = function(input, opts = defaultConfig) {
					setHTML(this, input, opts);
				};
				polyfilled = true;
			}
		}

		return polyfilled;
	};

	return { setHTML, polyfill };
}

export const trustPolicies = [policyName];
