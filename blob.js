import { polyfillMethod } from './utils.js';

polyfillMethod(Blob.prototype, 'bytes', async function () {
	return new Uint8Array(await this.arrayBuffer());
});
