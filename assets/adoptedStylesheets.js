/**
 * This **REQUIRES** a CSP with `style-src blob:`
 */
export const adoptedStyleSheets = {
	get() {
		return Array.from(this.styleSheets)
			.filter(sheet => sheet.ownerNode.classList.contains('_adopted'));
	},
	set(sheets) {
		if (! Array.isArray(sheets)) {
			throw new TypeError('Must be an array');
		} else {
			const current = new Set(this.adoptedStyleSheets);

			current.difference(sheets).forEach(sheet => sheet.ownerNode.remove());

			const links = [...new Set(sheets).difference(current)].map(sheet => {
				const link = document.createElement('link');
				const controller = new AbortController();
				const signal = controller.signal;
				const url = URL.createObjectURL(new File([], 'adopted.css', { type: 'text/css' }));
				link.rel = 'stylesheet';
				link.href = url;
				link.classList.add('_adopted');
				link.disabled = sheet.disabled;


				link.addEventListener('load', ({ target }) => {
					controller.abort();
					link.media = sheet.media.mediaText;
					[...sheet.cssRules].forEach((rule, index) => {
						target.sheet.insertRule(rule.cssText, index);
					});

					setTimeout(() => URL.revokeObjectURL(target.href), 100);
				}, { once: true, signal });

				link.addEventListener('error', ({ target }) => {
					controller.abort();
					URL.revokeObjectURL(target.href);
				}, { once: true, signal });

				return link;
			});

			if (this instanceof Document) {
				this.head.append(...links);
			} else {
				this.append(...links);
			}
		}
	}
};
