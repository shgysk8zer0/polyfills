import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import '@shgysk8zer0/polyfills/iterator.js';
import '@shgysk8zer0/polyfills/promise.js';

describe('Promise polyfills', () => {
	describe('Promise.allKeyed()', () => {
		test('resolves an object with mixed promises and literal values', async () => {
			const input = {
				num: Promise.resolve(42),
				str: 'hello',
				bool: Promise.resolve(true)
			};

			const result = await Promise.allKeyed(input);

			assert.deepEqual(result, {
				num: 42,
				str: 'hello',
				bool: true
			});
		});

		test('rejects immediately if any promise rejects', async () => {
			const expectedError = new Error('Test rejection');
			const input = {
				success: Promise.resolve(1),
				fail: Promise.reject(expectedError)
			};

			await assert.rejects(
				Promise.allKeyed(input),
				expectedError
			);
		});

		test('preserves and resolves Symbol keys', async () => {
			const sym = Symbol('test');
			const input = {
				[sym]: Promise.resolve('symbol value'),
				standard: 123
			};

			const result = await Promise.allKeyed(input);

			assert.equal(result[sym], 'symbol value');
			assert.equal(result.standard, 123);
		});

		test('handles empty objects correctly', async () => {
			const result = await Promise.allKeyed({});
			assert.deepEqual(result, {});
		});

		test('throws TypeError if argument is not an object', async () => {
			await assert.rejects(
				// @ts-expect-error - intentionally passing invalid type
				Promise.allKeyed(null),
				TypeError
			);
			await assert.rejects(
				// @ts-expect-error - intentionally passing invalid type
				Promise.allKeyed('string'),
				TypeError
			);
		});
	});

	describe('Promise.allSettledKeyed()', () => {
		test('resolves an object of settled statuses for mixed results', async () => {
			const expectedError = new Error('Network fail');
			const input = {
				resolvedProm: Promise.resolve('ok'),
				rejectedProm: Promise.reject(expectedError),
				literalVal: 99
			};

			const result = await Promise.allSettledKeyed(input);

			assert.deepEqual(result, {
				resolvedProm: { status: 'fulfilled', value: 'ok' },
				rejectedProm: { status: 'rejected', reason: expectedError },
				literalVal: { status: 'fulfilled', value: 99 }
			});
		});

		test('preserves and settles Symbol keys correctly', async () => {
			const sym1 = Symbol('success');
			const sym2 = Symbol('fail');
			const error = new Error('Symbol error');

			const input = {
				[sym1]: Promise.resolve(1),
				[sym2]: Promise.reject(error)
			};

			const result = await Promise.allSettledKeyed(input);

			assert.deepEqual(result[sym1], { status: 'fulfilled', value: 1 });
			assert.deepEqual(result[sym2], { status: 'rejected', reason: error });
		});

		test('handles empty objects correctly', async () => {
			const result = await Promise.allSettledKeyed({});
			assert.deepEqual(result, {});
		});

		test('throws TypeError if argument is not an object', async () => {
			await assert.rejects(
				// @ts-expect-error - intentionally passing invalid type
				Promise.allSettledKeyed(undefined),
				TypeError
			);
			await assert.rejects(
				// @ts-expect-error - intentionally passing invalid type
				Promise.allSettledKeyed(123),
				TypeError
			);
		});
	});
});

