(function() {
	'use strict';

	if (typeof globalThis === 'undefined') {
		/* global global: true */
		if (typeof window !== 'undefined') {
			Object.defineProperty(Window.prototype, 'globalThis', {
				enumerable: false,
				writable: true,
				configurable: true,
				value: window,
			});
		} else if (typeof global !== 'undefined') {
			Object.defineProperty(global, 'globalThis', {
				enumerable: false,
				writable: true,
				configurable: true,
				value: global,
			});
		} else if (typeof self !== 'undefined') {
			Object.defineProperty(self, 'globalThis', {
				enumerable: false,
				writable: true,
				configurable: true,
				value: self,
			});
		} else {
			Object.defineProperty(this, 'globalThis', {
				enumerable: false,
				writable: true,
				configurable: true,
				value: this,
			});
		}
	}
})();
