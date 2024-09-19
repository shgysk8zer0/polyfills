import { describe, test } from 'node:test';
import assert from 'node:assert';
import '@shgysk8zer0/polyfills/symbols';
const signal = AbortSignal.timeout(30_000);

describe('Testing `Symbol`s', () => {
	test('Test static `Symol` methods', { signal }, () => {
		assert.ok(Symbol.isWellKnown(Symbol.iterator), 'Symbol.iterator should be a well-known symbol.');
		assert.ok(! Symbol.isWellKnown(Symbol('dfjkgdfg')), 'User-defined symbols should not be well-known.');
		assert.ok(Symbol.isRegistered(Symbol.for('foo')), 'Symbols created via `Symbol.for()` should be registered.');
		assert.ok(! Symbol.isRegistered(Symbol('dne-djkfgbodkgj')), 'Symbols created via `Symbol()` should not be registered.');
	});
});
