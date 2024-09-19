import { describe, test } from 'node:test';
import assert from 'node:assert';
import '@shgysk8zer0/polyfills/map';
// import '@shgysk8zer0/polyfills/iterator';
const signal = AbortSignal.timeout(30_000);

describe('Testing `Map`', () => {
	test('Test `Map.emplace`', { signal }, async () => {
		const events = await fetch(new URL('./events.json', 'https://events.kernvalley.us')).then(resp => resp.json());

		const map = Map.groupBy(events, event => Symbol.for(event.location.address.addressLocality));
		const strKey = 'Kernville';
		const key = Symbol.for(strKey);
		const len = map.has(key) ? map.get(key).length : 0;

		map.emplace(key, {
			insert() {
				return [`Inserting into ${strKey}.`];
			},
			update(events) {
				return [...events, `Updating into ${strKey}.`];
			}
		});

		assert.ok(map.has(key),`Map does not contain entry for Symbol(${strKey}).`);
		assert.notEqual(map.get(key).length, len, `Failed to update and append map for Symbol(${strKey}).`);
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
