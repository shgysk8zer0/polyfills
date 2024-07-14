import { polyfillMethod } from './utils.js';

polyfillMethod(Request.prototype, 'bytes', async function () {
	return new Uint8Array(await this.arrayBuffer());
});
