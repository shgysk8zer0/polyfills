import { describe, test } from 'node:test';
import assert from 'node:assert';
import '@shgysk8zer0/polyfills/map';
// import '@shgysk8zer0/polyfills/iterator';
const signal = AbortSignal.timeout(30_000);

describe('Testing `Map`', () => {
	test('Test `Map.getOrInsert`', { signal }, async () => {
		const map = new Map([['bar', 'foo']]);
		assert.strictEqual(map.getOrInsert('bar', 'default'), 'foo');
		assert.strictEqual(map.getOrInsert('baz', 'default'), 'default');
	});

	test('Test `Map.groupBy`', { signal }, () => {
		const arr = [{ key: 'key', value: 'value' }, { key: 'key', value: 'Another' }, { key: 'foo', value: 'Something else' }];
		const map = Map.groupBy(arr, item => item.key);
		assert.deepEqual(map, new Map([
			['key', [{ key: 'key', value: 'value' }, { key: 'key', value: 'Another' }]],
			['foo', [{ key: 'foo', value: 'Something else' }]],
		]), 'Map.groupBy should have expected values');
	});
});
