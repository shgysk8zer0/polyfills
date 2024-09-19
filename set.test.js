import { describe, test } from 'node:test';
import assert from 'node:assert';
import '@shgysk8zer0/polyfills/set';
import '@shgysk8zer0/polyfills/iterator';
const signal = AbortSignal.timeout(30_000);

describe('Testing `Set`', () => {
	test('Test `Set` helper methods', { signal }, () => {
		const evens = new Set(Iterator.range(0, 100, { step: 2 }));
		const odds = new Set(Iterator.range(1, 100, { step: 2 }));
		const nums = new Set(Iterator.range(0, 100));
		const union = odds.union(evens);
		const diff = nums.symmetricDifference(union);

		assert.equal(diff.size, 0, 'Union of evens with odds should result in all integers.');
		assert.ok(odds.isSubsetOf(nums), 'Odd numbers should be a subset of all numbers.');
		assert.ok(evens.isSubsetOf(nums), 'Even numbers should be a subset of all numbers.');
		assert.ok(odds.isDisjointFrom(evens), 'Odds and evens should be disjoint sets.');
	});
});
