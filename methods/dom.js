const HOSTS_SYMBOL = Symbol('shadow:hosts');

function getTagHTML(el) {
	const outerHTML = el.cloneNode().outerHTML;
	const closeStart = outerHTML.indexOf('/') - 1;
	return closeStart > 0 ? [outerHTML.substring(0, closeStart), outerHTML.substring(closeStart)] : [outerHTML, ''];
}

function attachShadow(template){
	if (template instanceof HTMLTemplateElement && template.parentElement instanceof HTMLElement) {
		const shadow = template.parentElement.attachShadow({
			mode: template.getAttribute('shadowrootmode'),
			clonable: template.hasAttribute('shadowrootclonable'),
			delegatesFocus: template.hasAttribute('shadowrootdelegatesfocus'),
			serializable: template.hasAttribute('shadowrootserializable'),
		});

		shadow.append(template.content);
		template.remove();
	}
}

function serializeChildNodes(node, { serializableShadowRoots = false, shadowRoots = [], [HOSTS_SYMBOL]: hosts = [] } = {}) {
	return Array.from(
		node.childNodes,
		child => {
			if (child.nodeType === Node.ELEMENT_NODE) {
				const [open, close] = getTagHTML(child);
				return open + child.getHTML({ serializableShadowRoots, shadowRoots, [HOSTS_SYMBOL]: hosts }) + close;
			} else {
				return child.textContent;
			}
		}
	).join('');
}

function serializeShadowRoot(shadow, { serializableShadowRoots, shadowRoots, [HOSTS_SYMBOL]: hosts = [] } = {}) {
	if (shadow.serializable) {
		const openTag = `<template shadowrootmode="${shadow.mode}"`;
		const attrs = [];

		if (shadow.clonable) {
			attrs.push(' shadowrootclonable=""');
		}

		if (shadow.serializable) {
			attrs.push(' shadowrootserializable=""');
		}

		if (shadow.delegatesFocus) {
			attrs.push(' shadowrootdelegatesfocus=""');
		}

		const tag = attrs.length === 0 ? openTag + '>' : openTag + ' ' + attrs.join('') + '>';

		return tag + serializeChildNodes(shadow, { serializableShadowRoots, shadowRoots, [HOSTS_SYMBOL]: hosts }) + '</template>';
	} else {
		return serializeChildNodes(shadow, { serializableShadowRoots, shadowRoots, [HOSTS_SYMBOL]: hosts });
	}
}

export function parseHTMLUnsafe(input){
	const parser = new DOMParser();
	// Ensures `URL` is "about:blank"
	const doc = document.implementation.createHTMLDocument();
	// Rely on this method's TrustedTypes implementation, if available
	const parsed = parser.parseFromString(input, 'text/html');
	doc.head.append(...parsed.head.childNodes);
	doc.body.append(...parsed.body.childNodes);
	doc.querySelectorAll('* > template[shadowrootmode]').forEach(attachShadow);
	return doc;
}

export function setHTMLUnsafe(input) {
	const parser = new DOMParser();
	// Rely on this method's TrustedTypes implementation, if available
	const parsed = parser.parseFromString(input, 'text/html');
	const frag = document.createDocumentFragment();
	frag.append(...parsed.body.childNodes);
	frag.querySelectorAll('* > template[shadowrootmode]').forEach(attachShadow);
	this.replaceChildren(frag);
}

export function getHTML({ serializableShadowRoots = false, shadowRoots = [], [HOSTS_SYMBOL]: hosts = [] } = {}) {
	if (serializableShadowRoots && hosts.length === 0 && shadowRoots.length !== 0) {
		hosts.push(...shadowRoots.map(shadow => shadow.host));
	}

	switch(this.nodeType) {
		case Node.ELEMENT_NODE:
			if (
				serializableShadowRoots
				&& this.shadowRoot instanceof ShadowRoot
				&& (this.shadowRoot.serializable || shadowRoots.includes(this.shadowRoot))
			) {
				return this.shadowRoot.getHTML({ serializableShadowRoots, shadowRoots, [HOSTS_SYMBOL]: hosts })
					+ serializeChildNodes(this,{ serializableShadowRoots, shadowRoots, [HOSTS_SYMBOL]: hosts } );
			} else if (serializableShadowRoots && hosts.includes(this)) {
				const shadow = shadowRoots.find(shadow => shadow.host.isSameNode(this));

				return serializeShadowRoot(shadow, { serializableShadowRoots, shadowRoots, [HOSTS_SYMBOL]: hosts })
					+ serializeChildNodes(this, { serializableShadowRoots, shadowRoots, [HOSTS_SYMBOL]: hosts } );
			} else {
				return this.innerHTML;
			}

		case Node.DOCUMENT_FRAGMENT_NODE:
			if (! (this instanceof ShadowRoot)) {
				return '';
			} else if (serializableShadowRoots && (this.serializable || shadowRoots.includes(this))) {
				return serializeShadowRoot(this, { serializableShadowRoots, shadowRoots, [HOSTS_SYMBOL]: hosts });
			} else {
				return serializeChildNodes(this, { serializableShadowRoots, shadowRoots, [HOSTS_SYMBOL]: hosts });
			}

		default:
			throw new TypeError('\'getHTML\' called on an object that does not implement interface Element.');
	}
}
