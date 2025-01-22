import './streams.js';
import { describe, test } from 'node:test';
import { strictEqual, throws } from 'node:assert';

describe('Check iterator polyfills', () => {
	test('Test `ReadableStream.from()` polyfill', async () => {
		const text = 'Hello, World!';
		const stream = ReadableStream.from(text).pipeThrough(new TextEncoderStream());

		strictEqual(await new Response(stream).text(), text, 'Stream should result in the original text input.');
		throws(() => ReadableStream.from(null), { name: 'TypeError' }, 'Should throw a `TypeError` for non-iterable objects.');
	});
});
