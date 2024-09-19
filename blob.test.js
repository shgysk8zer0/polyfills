import { describe, test } from 'node:test';
import assert from 'node:assert';
import '@shgysk8zer0/polyfills/blob';
import '@shgysk8zer0/polyfills/array';
const signal = AbortSignal.timeout(30_000);

describe('Testing `Blob`', () => {
	test('Test `Blob.bytes` and `Uint8Array` base64 encoding/decoding', { signal }, async () => {
		const message = 'Hello, World!';
		const alphabet = 'base64';
		const blob = new Blob([message], { type: 'text/plain' });
		const bytes = await blob.bytes();
		const encoded = bytes.toBase64({ alphabet });
		const decoded = new TextDecoder().decode(Uint8Array.fromBase64(encoded, { alphabet }));

		assert.equal(encoded, 'SGVsbG8sIFdvcmxkIQ==', 'Expected base64 encoding to result in "SGVsbG8sIFdvcmxkIQ==".');
		assert.equal(decoded, message, 'Expected decoded message to be identical to original.');
	});
});
