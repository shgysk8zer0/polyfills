import { polyfillMethod, polyfillGetterSetter } from './utils.js';
import { safeParseHTML } from './assets/sanitizerUtils.js';
import { adoptedStyleSheets } from './assets/adoptedStylesheets.js';

polyfillMethod(Document, 'parseHTML', (...args) => safeParseHTML(...args));
polyfillGetterSetter(Document.prototype, 'adoptedStyleSheets', adoptedStyleSheets);
