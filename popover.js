// function handlePopover({ currentTarget }) {
// 	currentTarget.addEventListener('click', ({ currentTarget }) => {
// 		switch(currentTarget.popoverTargetAction) {
// 			case 'show':
// 				currentTarget.popoverTargetElement.showPopover();
// 				break;

// 			case 'hide':
// 				currentTarget.popoverTargetElement.hidePopover();
// 				break;

// 			default:
// 				currentTarget.popoverTargetElement.togglePopover();
// 		}
// 	}, { capture: true });
// }

// export function initPopover(target = document.body) {
// 	target.querySelectorAll('button[popovertarget], input[type="button"][popovertarget]')
// 		.forEach(el => el.addEventListener('click', handlePopover));
// }

// if ((globalThis.ToggleEvent instanceof Function)) {
// 	class ToggleEvent extends Event {
// 		#newState;
// 		#oldState;

// 		constructor(type, { newState, oldState }) {
// 			super(type, { bubbles: true });
// 			this.#newState = newState;
// 			this.#oldState = oldState;
// 		}

// 		get newState() {
// 			return this.#newState;
// 		}

// 		get oldState() {
// 			return this.#oldState;
// 		}
// 	}

// 	globalThis.ToggleEvent = ToggleEvent;
// }

// if (! (HTMLElement.prototype.showPopover instanceof Function)) {
// 	const isPopoverOpen = el => el.classList.contains('_popover-open');

// 	Object.defineProperties(HTMLElement.prototype, {
// 		showPopover: {
// 			value: function showPopover() {
// 				if (! isPopoverOpen(this)) {
// 					this.dispatchEvent(new ToggleEvent('beforetoggle', { oldState: 'closed', newState: 'open' }));

// 					if (this.getAttribute('popover') === 'auto') {
// 						const controller = new AbortController();

// 						document.body.addEventListener('click', ({ target }) => {
// 							if (! this.contains(target) && ! this.isSameNode(target.popoverTargetElement)) {
// 								controller.abort();
// 								this.hidePopover();
// 							}
// 						}, { signal: controller.signal,  capture: true });

// 						document.body.addEventListener('keydown', ({ key }) => {
// 							if (key === 'Escape') {
// 								controller.abort();
// 								this.hidePopover();
// 							}
// 						}, { signal: controller.signal, capture: true });

// 						document.addEventListener('beforetoggle', ({ target }) => {
// 							if (! target.isSameNode(this) && target.getAttribute('popover') === 'auto') {
// 								controller.abort();
// 								this.hidePopover();
// 							}
// 						}, { signal: controller.signal });
// 					}

// 					this.classList.add('_popover-open');
// 					this.dispatchEvent(new ToggleEvent('toggle', { oldState: 'closed', newState: 'open' }));
// 				}
// 			}
// 		},
// 		hidePopover: {
// 			value: function hidePopover() {
// 				if (isPopoverOpen(this)) {
// 					this.dispatchEvent(new ToggleEvent('beforetoggle', { oldState: 'open', newState: 'closed' }));
// 					queueMicrotask(() => this.classList.remove('_popover-open'));
// 					this.dispatchEvent(new ToggleEvent('toggle', { oldState: 'open', newState: 'closed' }));
// 				}
// 			}
// 		},
// 		togglePopover: {
// 			value: function togglePopover() {
// 				isPopoverOpen(this) ? this.hidePopover() : this.showPopover();
// 			}
// 		}
// 	});

// 	Object.defineProperties(HTMLButtonElement.prototype, {
// 		popoverTargetElement: {
// 			get() {
// 				return document.getElementById(this.getAttribute('popovertarget'));
// 			}
// 		},
// 		popoverTargetAction: {
// 			get() {
// 				return this.getAttribute('popovertargetaction') || 'toggle';
// 			},
// 			set(val) {
// 				this.setAttribute('popovertargetaction', val);
// 			}
// 		}
// 	});

// 	initPopover();
// }
