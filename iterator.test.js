import { describe, test } from 'node:test';
import assert from 'node:assert';
import '@shgysk8zer0/polyfills/iterator';
const signal = AbortSignal.timeout(30_000);

describe('Testing `Iterator`', () => {
	test('Test `Iterator.range` via sum', { signal }, () => {
		const sum = Iterator.range(1, 100, { inclusive: true }).reduce((sum, num) => sum + num);
		assert.equal(sum, 5050, `Expected sum from 1-100 to be 5050 but got ${sum}.`);
	});

	test('zips iterables of the same length correctly', () => {
		const iter = Iterator.zip([[1, 2, 3], ['a', 'b', 'c']]);
		assert.deepEqual(Array.from(iter), [
			[1, 'a'],
			[2, 'b'],
			[3, 'c']
		]);
	});

	test('defaults to shortest mode and stops early', () => {
		const iter = Iterator.zip([[1, 2, 3, 4], ['a', 'b']]);
		assert.deepEqual(Array.from(iter), [
			[1, 'a'],
			[2, 'b']
		]);
	});

	test('respects longest mode without padding (fills with undefined)', () => {
		const iter = Iterator.zip([[1, 2], ['a']], { mode: 'longest' });
		assert.deepEqual(Array.from(iter), [
			[1, 'a'],
			[2, undefined]
		]);
	});

	test('respects longest mode with custom padding iterable', () => {
		const iter = Iterator.zip(
			[[1], ['a', 'b']],
			{ mode: 'longest', padding: [99, 'z'] }
		);
		assert.deepEqual(Array.from(iter), [
			[1, 'a'],
			[99, 'b']
		]);
	});

	test('respects strict mode for equal lengths', () => {
		const iter = Iterator.zip([[1, 2], ['a', 'b']], { mode: 'strict' });
		assert.deepEqual(Array.from(iter), [
			[1, 'a'],
			[2, 'b']
		]);
	});

	test('throws in strict mode if iterables are different lengths', () => {
		const iter = Iterator.zip([[1, 2, 3], ['a', 'b']], { mode: 'strict' });
		assert.throws(
			() => Array.from(iter),
			TypeError
		);
	});

	test('throws TypeError if inner elements are strings', () => {
		assert.throws(
			() => Iterator.zip(['abc', [1, 2, 3]]),
			TypeError
		);
	});

	test('throws TypeError if the outer argument is a raw iterator rather than an iterable', () => {
		const generatorObj = (function* () { yield [1]; yield [2]; })();
		assert.throws(
			() => Iterator.zip(generatorObj),
			TypeError
		);
	});

	test('gracefully closes remaining iterators on early exit', () => {
		let closed = false;
		const customIterable = {
			[Symbol.iterator]() {
				return {
					next: () => ({ value: 1, done: false }),
					return: () => {
						closed = true;
						return { done: true, value: undefined };
					}
				};
			}
		};

		const iter = Iterator.zip([customIterable, ['a']]); // Shortest mode by default
		Array.from(iter); // Will stop after 1 iteration because ['a'] exhausts

		assert.equal(closed, true);
	});
});
