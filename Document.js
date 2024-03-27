import { polyfillGetterSetter } from './utils.js';
import { adoptedStyleSheets } from './assets/adoptedStylesheets.js';

polyfillGetterSetter(Document.prototype, 'adoptedStyleSheets', adoptedStyleSheets);
