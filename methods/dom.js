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

export function parseHTMLUnsafe(input){
	const parser = new DOMParser();
	// Ensures `URL` is "about:blank"
	const doc = document.implementation.createHTMLDocument();
	// Rely on this method's TrustedTypes implementation, if available
	const parsed = parser.parseFromString(input, 'text/html');
	doc.head.append(...parsed.head.childNodes);
	doc.body.append(...parsed.body.childNodes);
	doc.querySelectorAll('template[shadowrootmode]').forEach(attachShadow);
	return doc;
}

export function setHTMLUnsafe(input) {
	const parser = new DOMParser();
	// Rely on this method's TrustedTypes implementation, if available
	const parsed = parser.parseFromString(input, 'text/html');
	const frag = document.createDocumentFragment();
	frag.append(...parsed.body.childNodes);
	attachShadow(frag.querySelector('template[shadowroootmode]'));
	this.replaceChildren(frag);
}

export function getHTML() {
	return this.innerHTML;
}
