import '../../all.js';
import { sanitizer } from '@aegisjsproject/sanitizer/config/base.js';

trustedTypes.createPolicy('default', {
	createHTML(input) {
		const el = document.createElement('div');
		el.setHTML(input, { sanitizer });
		return el.innerHTML;
	}
});

class TestEl extends HTMLElement {
	#internals;
	#shadow;

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: 'open' });
		this.#internals = this.attachInternals();

		const tmp = Document.parseHTML(`<div id="container">
			<h2 id="title">Lorem Ipsum</h2>
			<p id="content"><slot name="content">Eum doloribus esse voluptate. Iste neque eum itaque harum non qui cumque id. Laborum officiis voluptatem at sed et repellendus molestiae et. Cum dolor doloribus reiciendis. Quisquam veniam cum officia ex reprehenderit voluptatem sequi id.</slot></p>
		</div>`);

		new CSSStyleSheet({ media: '(min-width: 800px)' }).replace(`
			:host {
				display: inline-block;
				box-sizing: border-box;
			}

			#container {
				display: inline-block;
				padding: 1.2em;
				border: 1px solid #dadada;
				background-color: #232323;
				color: #fafafa;
				box-sizing: border-box;
			}

			#title {
				text-align: center;
			}

			#content {
				font-family: system-ui;
			}
		`).then(sheet => {
			this.#shadow.adoptedStyleSheets = [sheet];
			this.#shadow.append(...tmp.body.children);
		});
	}
}

customElements.define('test-el', TestEl);
document.getElementById('main').append(new TestEl());
