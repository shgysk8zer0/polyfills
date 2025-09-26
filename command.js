if (! ('command' in HTMLButtonElement.prototype)) {
	const COMMAND_FOR = Symbol('command:for');

	const CLICK_OPTIONS = { passive: true };

	Object.defineProperty(HTMLButtonElement.prototype, 'command', {
		get() {
			return this.getAttribute('command');
		},
		set(val) {
			if (typeof val === 'string') {
				this.setAttribute('command', val);
			} else {
				this.removeAttribute('command');
			}
		}
	});

	Object.defineProperty(HTMLButtonElement.prototype, 'commandForElement', {
		get() {
			if (this[COMMAND_FOR] instanceof Element) {
				return this[COMMAND_FOR];
			} else if (this.hasAttribute('commandfor')) {
				return document.getElementById(this.getAttribute('commandfor'));
			} else {
				return null;
			}
		},
		set(val) {
			if (! (val instanceof Element)) {
				this.removeAttribute('commandfor');
				this[COMMAND_FOR] = null;
			} else if (val.id.length === 0) {
				this.setAttribute('commandfor', '');
				this[COMMAND_FOR] = val;
			} else {
				this.setAttribute('commandfor', val.id);
				this[COMMAND_FOR] = null;
			}
		}
	});

	class CommandEvent extends Event {
		#source = null;
		#command = '';

		constructor(type, { source, command, bubbles, cancelable, composed } = {}) {
			super(type, { bubbles, cancelable, composed });

			if (typeof command === 'string') {
				this.#command = command;
			}

			if (source instanceof HTMLButtonElement) {
				this.#source = source;
			}
		}

		get command() {
			return this.#command;
		}

		get source() {
			return this.#source;
		}
	}

	function dispatchCommand({ currentTarget }) {
		if (currentTarget instanceof HTMLButtonElement && currentTarget.hasAttribute('command') && currentTarget.hasAttribute('commandfor')) {
			const target = currentTarget.commandForElement;
			const command = currentTarget.command;

			if (target instanceof Element && typeof command === 'string') {
				const event = new CommandEvent('command', { command, source: currentTarget, cancelable: true });
				target.dispatchEvent(event);

				if (! event.defaultPrevented) {
					switch(command) {
						case 'show-modal':
							if (target instanceof HTMLDialogElement) {
								target.showModal();
							}
							break;

						case 'close':
							if (target instanceof HTMLDialogElement) {
								target.close();
							}
							break;

						case 'request-close':
							if (target instanceof HTMLDialogElement) {
								target.requestClose();
							}
							break;

						case 'show-popover':
							target.showPopover();
							break;

						case 'hide-popover':
							target.hidePopover();
							break;

						case 'toggle-popover':
							target.togglePopover();
							break;
					}
				}
			}
		}
	}

	const observer = new MutationObserver(mutations => {
		for (const mutation of mutations) {
			if (mutation.type === 'childList') {
				for (const node of mutation.addedNodes) {
					if (node instanceof HTMLButtonElement && node.hasAttribute('command') && node.hasAttribute('commandfor')) {
						node.addEventListener('click', dispatchCommand, CLICK_OPTIONS);
					} else if (node instanceof Element) {
						for (const btn of node.querySelectorAll('button[command][commandfor]')) {
							btn.addEventListener('click', dispatchCommand, CLICK_OPTIONS);
						}
					}
				}
			} else if (
				mutation.type === 'attributes'
				&& mutation.target instanceof HTMLButtonElement
				&& typeof mutation.oldValue !== typeof mutation.target.getAttribute(mutation.attributeName)
			) {
				if (mutation.target.hasAttribute('command') && mutation.target.hasAttribute('commandfor')) {
					mutation.target.addEventListener('click', dispatchCommand, CLICK_OPTIONS);
				} else {
					mutation.target.removeEventListener('click', dispatchCommand, CLICK_OPTIONS);
				}
			}
		}
	});

	const config = { childList: true, subtree: true, attributes: true, attributeFilter: ['command', 'commandfor'], attributeOldValue: true };
	observer.observe(document, config);
	document.querySelectorAll('button').forEach(btn => btn.addEventListener('click', dispatchCommand, CLICK_OPTIONS));
	globalThis.CommandEvent = CommandEvent;
	// For use in Shadow DOM
	globalThis[Symbol.for('polyfill-command')] = target => observer.observe(target, config);
}
