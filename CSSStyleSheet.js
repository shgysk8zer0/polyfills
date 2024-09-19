export function createSheet(rules = '', { disabled = false, media } = {}) {
	const style = Document.parseHTML(
		`<style>${rules}</style>`,
		{ sanitizer: { allowElements: ['style', 'html', 'head', 'body'] }}
	);

	const sheet = style.styleSheets.item(0);

	if (typeof media === 'string') {
		sheet.media.appendMedium(media);
	}
	sheet.disabled = disabled;
	return sheet;
}

export function clearCSSRules(sheet) {
	while (sheet.cssRules.length > 0) {
		sheet.deleteRule(0);
	}
}

try {
	new CSSStyleSheet();
} catch {
	const NativeStyleSheet = globalThis.CSSStyleSheet;

	globalThis.CSSStyleSheet = function CSSStyleSheet({ disabled = false, media } = {}) {
		// Need at least one rule to create the `.sheet`
		const sheet = createSheet('#dfgbkjdfg{color:red;}', { disabled, media });
		sheet.deleteRule(0);
		return sheet;
	};

	globalThis.CSSStyleSheet.prototype = NativeStyleSheet.prototype;
	NativeStyleSheet.prototype.constructor = globalThis.CSSStyleSheet;
}

if (! (CSSStyleSheet.prototype.replace instanceof Function)) {
	CSSStyleSheet.prototype.replace = function replace(rules) {
		const link = document.createElement('link');
		const controller = new AbortController();
		const { resolve, reject, promise } = Promise.withResolvers();

		link.addEventListener('load', ({ target }) => {
			clearCSSRules(this);
			[...target.sheet.cssRules].forEach((rule, i) => this.insertRule(rule.cssText, i));
			resolve(this);
			controller.abort();
			URL.revokeObjectURL(target.href);
			target.remove();
		}, { once: true, signal: controller.signal });

		link.addEventListener('error', ({ target }) => {
			const error = new DOMException('Error loading stylesheet.');
			reject(error);
			controller.abort(error);
			URL.revokeObjectURL(target.href);
			target.remove();
		}, { once: true, signal: controller.signal });

		link.rel = 'stylesheet';
		link.crossOrigin = 'anonymous';
		link.referrerPolicy = 'no-referrer';
		link.media = 'no-op';
		link.href = URL.createObjectURL(new File([rules], 'tmp.css', { type: 'text/css' }));
		document.head.append(link);

		return promise;
	};
}

if (! (CSSStyleSheet.prototype.replaceSync instanceof Function)) {
	CSSStyleSheet.prototype.replaceSync = function replaceSync(rules) {
		const sheet = Document.parseHTML(
			`<style>${rules}</style>`,
			{ sanitizer: { allowElements: ['style', 'html', 'head', 'body'] }}
		).styleSheets.item(0);

		clearCSSRules(this);

		[...sheet.cssRules].forEach((rule, i) => this.insertRule(rule.cssText, i));
	};
}
