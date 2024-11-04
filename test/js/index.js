import '@shgysk8zer0/polyfills';
import { sanitizer } from '@aegisjsproject/sanitizer/config/base.js';

trustedTypes.createPolicy('default', {
	createHTML(input) {
		const el = document.createElement('div');
		el.setHTML(input, { sanitizer });
		return el.innerHTML;
	}
});

class AdoptableStyle extends HTMLElement {
	#sheet;
	#root = null;

	static #ownStyles = new CSSStyleSheet().replace(':host {display: none;}');

	constructor({ baseURL, disabled, media } = {}) {
		super();
		const shadow = this.attachShadow({ mode: 'closed' });
		const styles = document.createElement('slot');
		styles.name = 'css';
		shadow.append(styles);
		styles.addEventListener('slotchange', async ({ target }) => {
			const assigned = target.assignedElements();
			await this.#sheet.replace(assigned.map(el => el.innerHTML).join('\n\n'));
		});

		AdoptableStyle.#ownStyles.then(sheet => shadow.adoptedStyleSheets = [sheet]);

		if (typeof this.baseURL !== 'undefined') {
			this.baseURL = baseURL;
		}

		if (typeof disabled !== 'undefined') {
			this.disabled = disabled;
		}

		if (typeof media !== 'undefined') {
			this.media = media;
		}

		this.#sheet = new CSSStyleSheet({ disabled: this.disabled, media: this.media, baseURL: this.baseURL });
	}

	get baseURL() {
		return this.getAttribute('baseurl') ?? undefined;
	}

	set baseURL(val) {
		if ((typeof val === 'string' && val.length !== 0) || val instanceof URL) {
			this.setAttribute('baseurl', val);
		} else {
			this.removeAttribute('baseurl');
		}
	}

	get cssRules() {
		return this.#sheet.cssRules;
	}

	get disabled() {
		return this.hasAttribute('disabled');
	}

	set disabled(val) {
		this.toggleAttribute('disabled', val);
	}

	get media() {
		return this.getAttribute('media') ?? undefined;
	}

	set media(val) {
		if (typeof val === 'string' && val.length !== 0) {
			this.setAttribute('media', val);
		} else if (val instanceof MediaQueryList) {
			this.setAttribute('media', val.media);
		} else {
			this.removeAttribute('media');
		}
	}

	get sheet() {
		return this.#sheet;
	}

	get type() {
		return 'text/css';
	}

	async connectedCallback() {
		try {
			this.#root = this.getRootNode();

			if (this.#root instanceof ShadowRoot || this.#root instanceof Document) {
				this.#root.adoptedStyleSheets = [...this.#root.adoptedStyleSheets, this.#sheet];
				this.dispatchEvent(new Event('load'));
			}
		} catch(err) {
			this.dispatchEvent(new ErrorEvent('error', { error: err }));
		}
	}

	disconnectedCallback() {
		if (this.#root instanceof ShadowRoot || this.#root instanceof Document) {
			this.#root.adoptedStyleSheets = this.#root.adoptedStyleSheets.filter(sheet => sheet !== this.#sheet);
			this.#root = null;
		}
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === 'disabled') {
			this.#sheet.disabled = typeof newValue === 'string';
		}
	}

	static get observedAttributes() {
		return ['disabled'];
	}
}

class TestEl extends HTMLElement {
	// #internals;
	#shadow;

	// static #policy = trustedTypes.createPolicy('test-el#html', {
	// 	createHTML(input) {
	// 		return input;
	// 	}
	// });

	constructor() {
		super();
		if (! (this.shadowRoot instanceof ShadowRoot)) {
			this.#shadow = this.attachShadow({ mode: 'open', serializable: true });
			console.log(this.#shadow.innerHTML);
		} else {
			this.#shadow = this.shadowRoot;
		}
		// this.#internals = this.attachInternals();

		// new CSSStyleSheet({ media: '(min-width: 800px)' }).replace(`
		// 	:host {
		// 		display: inline-block;
		// 		box-sizing: border-box;
		// 	}

		// 	#container {
		// 		display: inline-block;
		// 		padding: 1.2em;
		// 		border: 1px solid #dadada;
		// 		background-color: #232323;
		// 		color: #fafafa;
		// 		box-sizing: border-box;
		// 	}

		// 	#title {
		// 		text-align: center;
		// 	}

		// 	#content {
		// 		font-family: system-ui;
		// 	}
		// `).then(sheet => {
		// 	this.#shadow.adoptedStyleSheets = [sheet];
		// 	this.#shadow.setHTMLUnsafe(TestEl.#policy.createHTML(`<div id="container">
		// 		<h2 id="title">Lorem Ipsum</h2>
		// 		<p id="content"><slot name="content">Eum doloribus esse voluptate. Iste neque eum itaque harum non qui cumque id. Laborum officiis voluptatem at sed et repellendus molestiae et. Cum dolor doloribus reiciendis. Quisquam veniam cum officia ex reprehenderit voluptatem sequi id.</slot></p>
		// 	</div>`));
		// 	this.setHTMLUnsafe(TestEl.#policy.createHTML('<p slot="content">Bacon Ipsum.</p>'));
		// });
	}

	toString() {
		return this.getHTML({ serializableShadowRoots: true, shadowRoots: [this.#shadow] });
	}
}

customElements.define('test-el', TestEl);
customElements.define('adoptable-style', AdoptableStyle);
// document.getElementById('main').append(new TestEl());
