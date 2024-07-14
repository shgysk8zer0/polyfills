import { polyfillGetterSetter, polyfillMethod } from './utils.js';
import { adoptedStyleSheets } from './assets/adoptedStylesheets.js';
import { parseHTMLUnsafe } from './methods/dom.js';

polyfillGetterSetter(Document.prototype, 'adoptedStyleSheets', adoptedStyleSheets);
polyfillMethod(Document, 'parseHTMLUnsafe', parseHTMLUnsafe);
