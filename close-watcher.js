if (! (globalThis.CloseWatcher instanceof Function)) {
	globalThis.CloseWatcher = class CloseWatcher extends EventTarget {
		#controller = new AbortController();
		#cancelable = true;

		constructor() {
			super();

			document.addEventListener('keydown', event => {
				if (event.key === 'Escape') {
					this.requestClose();
				}
			}, { signal: this.#controller.signal });
		}

		requestClose() {
			if (! this.#controller.signal.aborted) {
				const event = new Event('cancel', { cancelable: this.#cancelable });
				this.dispatchEvent(event);
				this.#cancelable = false;

				if (! event.defaultPrevented) {
					this.close();
				}
			}
		}

		close() {
			if (! this.#controller.signal.aborted) {
				this.dispatchEvent(new Event('close'));
				this.destroy();
			}
		}

		destroy() {
			if (! this.#controller.signal.aborted) {
				this.#controller.abort();
			}
		}
	};
}
