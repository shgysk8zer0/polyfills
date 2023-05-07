import { TextEncoder } from './assets/TextEncoder.js';
import { TextDecoder } from './assets/TextDecoder.js';

if (! ('TextEncoder' in globalThis)) {
	globalThis.TextEncoder = TextEncoder;
}

if (! ('TextDecoder' in globalThis)) {
	globalThis.TextDecoder = TextDecoder;
}

if (! (globalThis.TextEncoder.prototype.encodeInto instanceof Function)) {
	globalThis.TextEncoder.prototype.encodeInto = function(...args) {
		return TextEncoder.prototype.encodeInto.apply(this, args);
	};
}
