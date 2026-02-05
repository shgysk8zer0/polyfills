if (typeof Symbol.dispose !== 'symbol') {
	Symbol.dispose = Symbol('Symbol.dispose');
}

if (typeof Symbol.asyncDispose !== 'symbol') {
	Symbol.asyncDispose = Symbol('Symbol.asyncDispose');
}

if (typeof globalThis.SuppressedError === 'undefined') {
	globalThis.SuppressedError = class SuppressedError extends Error {
		constructor(error, suppressed, message = '') {
			super(message);
			this.name = 'SuppressedError';
			this.error = error;
			this.suppressed = suppressed;
		}
	};
}

if (typeof globalThis.AsyncDisposableStack === 'undefined') {
	globalThis.AsyncDisposableStack = class AsyncDisposableStack {
		/**
		 * @type function[]
		 */
		#stack = [];
		#disposed = false;

		get [Symbol.toStringTag]() {
			return 'AsyncDisposableStack';
		}

		async[Symbol.asyncDispose]() {
			if (! this.#disposed) {
				let error;
				this.#disposed = true;

				while(this.#stack.length !== 0) {
					const onDispose = this.#stack.pop();
					await Promise.try(onDispose).catch(e => {
						if (typeof error === 'undefined') {
							error = e;
						} else {
							error = new SuppressedError(error, e, 'An error is suppressed because another error happened while disposing an object');
						}
					});
				}

				if (typeof error !== 'undefined') {
					throw error;
				}
			}
		}

		get disposed() {
			return this.#disposed;
		}

		adopt(value, onDispose) {
			if (this.#disposed) {
				throw new ReferenceError('AsyncDisposableStack has already been disposed');
			} else if (typeof onDispose !== 'function') {
				throw new TypeError(`(${onDispose}) is not a function.`);
			} else {
				this.#stack.push(() => onDispose(value));
				return value;
			}
		}

		defer(onDispose) {
			if (this.#disposed) {
				throw new ReferenceError('AsyncDisposableStack has already been disposed');
			} else if (typeof onDispose !== 'function') {
				throw new TypeError(`${onDispose} is not a function`);
			} else {
				this.#stack.push(onDispose);
			}
		}

		async asyncDispose() {
			await this[Symbol.asyncDispose]();
		}

		move() {
			if (this.#disposed) {
				throw new ReferenceError('AsyncDisposableStack has already been disposed');
			} else {
				const newStack = new AsyncDisposableStack();
				newStack.#stack = this.#stack;
				this.#stack = [];
				this.#disposed = true;
				return newStack;
			}
		}

		use(value) {
			switch (typeof value) {
				case 'function':
				case 'object':
					if (typeof value?.[Symbol.asyncDispose] === 'function') {
						this.#stack.push(value[Symbol.asyncDispose].bind(value));
						return value;
					} else if (typeof value?.[Symbol.dispose] === 'function') {
						this.#stack.push(value[Symbol.dispose].bind(value));
						return value;
					} else if (value === null) {
						return null;
					} else {
						throw new TypeError('\'Symbol.asyncDispose\' property is not callable');
					}

				case 'undefined':
					break;

				default:
					throw new TypeError('Value to be disposed is not an object');
			}
		}
	};
}

if (typeof globalThis.DisposableStack === 'undefined') {
	globalThis.DisposableStack = class DisposableStack {
		/**
		 * @type function[]
		 */
		#stack = [];
		#disposed = false;

		get [Symbol.toStringTag]() {
			return 'DisposableStack';
		}

		[Symbol.dispose]() {
			if (! this.#disposed) {
				this.#disposed = true;
				let error;

				while(this.#stack.length !== 0) {
					const onDispose = this.#stack.pop();

					try {
						onDispose();
					} catch(e) {
						if (typeof error === 'undefined') {
							error = e;
						} else {
							error = new SuppressedError(error, e, 'An error is suppressed because another error happened while disposing an object');
						}
					}
				}

				if (typeof error !== 'undefined') {
					throw error;
				}
			}
		}

		get disposed() {
			return this.#disposed;
		}

		adopt(value, onDispose) {
			if (this.#disposed) {
				throw new ReferenceError('DisposableStack has already been disposed');
			} else if (typeof onDispose !== 'function') {
				throw new TypeError(`(${onDispose}) is not a function.`);
			} else {
				this.#stack.push(() => onDispose(value));
				return value;
			}
		}

		defer(onDispose) {
			if (this.#disposed) {
				throw new ReferenceError('DisposableStack has already been disposed');
			} else if (typeof onDispose !== 'function') {
				throw new TypeError(`${onDispose} is not a function`);
			} else {
				this.#stack.push(onDispose);
			}
		}

		dispose() {
			this[Symbol.dispose]();
		}

		move() {
			if (this.#disposed) {
				throw new ReferenceError('DisposableStack has already been disposed');
			} else {
				const newStack = new DisposableStack();
				newStack.#stack = this.#stack;
				this.#stack = [];
				this.#disposed = true;
				return newStack;
			}
		}

		use(value) {
			switch (typeof value) {
				case 'function':
				case 'object':
					if (typeof value?.[Symbol.dispose] === 'function') {
						this.#stack.push(value[Symbol.dispose].bind(value));
						return value;
					} else if (value === null) {
						return null;
					} else {
						throw new TypeError('\'Symbol.dispose\' property is not callable');
					}

				case 'undefined':
					break;

				default:
					throw new TypeError('Value to be disposed is not an object');
			}
		}
	};
}
