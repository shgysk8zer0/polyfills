import { describe, test } from 'node:test';
import assert from 'node:assert';
import '@shgysk8zer0/polyfills/iterator';
const signal = AbortSignal.timeout(30_000);

describe('Testing `Iterator`', () => {
	test('Test `Iterator.range` via sum', { signal }, () => {
		const sum = Iterator.range(1, 100, { inclusive: true }).reduce((sum, num) => sum + num);
		assert.equal(sum, 5050, `Expected sum from 1-100 to be 5050 but got ${sum}.`);
	});
});
