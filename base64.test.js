import './array.js';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// RFC 4648 §10 test vectors — string → expected base64
const enc = new TextEncoder();
const vectors = [
	['',			 ''],
	['f',			'Zg=='],
	['fo',		 'Zm8='],
	['foo',		'Zm9v'],
	['foob',	 'Zm9vYg=='],
	['fooba',	'Zm9vYmE='],
	['foobar', 'Zm9vYmFy'],
];

// ── RFC 4648 vectors ──────────────────────────────────────────────────────────

describe('RFC 4648 test vectors', () => {
	for (const [input, expected] of vectors) {
		it(`encodes '${input}'`, () => {
			assert.equal(enc.encode(input).toBase64(), expected);
		});
	}
});

// ── Default options ───────────────────────────────────────────────────────────

describe('default options', () => {
	it('uses base64 alphabet by default', () => {
		// 0xFB 0xFF → '+/8=' in base64; '-_8=' in base64url
		assert.equal(new Uint8Array([0xfb, 0xff]).toBase64(), '+/8=');
	});

	it('includes padding by default', () => {
		assert.equal(enc.encode('fo').toBase64(), 'Zm8=');	 // 1 pad char
		assert.equal(enc.encode('f').toBase64(),	'Zg==');	// 2 pad chars
	});

	it('accepts an empty options object', () => {
		assert.equal(enc.encode('foo').toBase64({}), 'Zm9v');
	});

	it('accepts no argument at all', () => {
		assert.equal(enc.encode('foo').toBase64(), 'Zm9v');
	});
});

// ── alphabet option ───────────────────────────────────────────────────────────

describe('alphabet option', () => {
	it('explicit \'base64\' is identical to default', () => {
		const data = new Uint8Array([0xfb, 0xef, 0xff]);
		assert.equal(data.toBase64({ alphabet: 'base64' }), data.toBase64());
	});

	it('\'base64url\' substitutes + → - and / → _', () => {
		// 0xFB → last 6 bits cross the +/- boundary; 0xFF produces /→_
		assert.equal(
			new Uint8Array([0xfb, 0xff]).toBase64({ alphabet: 'base64url' }),
			'-_8='
		);
	});

	it('\'base64url\' never emits + or /', () => {
		// Exhaustive: all 256 byte values
		const all = new Uint8Array(256).map((_, i) => i);
		const encoded = all.toBase64({ alphabet: 'base64url' });
		assert.ok(!encoded.includes('+'), 'must not contain +');
		assert.ok(!encoded.includes('/'), 'must not contain /');
	});

	it('\'base64\' never emits - or _', () => {
		const all = new Uint8Array(256).map((_, i) => i);
		const encoded = all.toBase64({ alphabet: 'base64' });
		assert.ok(!encoded.includes('-'), 'must not contain -');
		assert.ok(!encoded.includes('_'), 'must not contain _');
	});

	it('throws TypeError for an unknown alphabet', () => {
		assert.throws(
			() => new Uint8Array([1]).toBase64({ alphabet: 'base32' }),
			TypeError
		);
	});

	it('throws TypeError for a non-string alphabet', () => {
		assert.throws(
			() => new Uint8Array([1]).toBase64({ alphabet: 42 }),
			TypeError
		);
	});
});

// ── omitPadding option ────────────────────────────────────────────────────────

describe('omitPadding option', () => {
	it('omits zero padding chars when input length is divisible by 3', () => {
		// 'foo' → 'Zm9v' — no change either way
		assert.equal(enc.encode('foo').toBase64({ omitPadding: true }), 'Zm9v');
	});

	it('omits one padding char (input.length % 3 === 2)', () => {
		assert.equal(enc.encode('fo').toBase64({ omitPadding: true }), 'Zm8');
	});

	it('omits two padding chars (input.length % 3 === 1)', () => {
		assert.equal(enc.encode('f').toBase64({ omitPadding: true }), 'Zg');
	});

	it('omitPadding: false is identical to default', () => {
		assert.equal(
			enc.encode('f').toBase64({ omitPadding: false }),
			enc.encode('f').toBase64()
		);
	});

	it('works with base64url + omitPadding together', () => {
		assert.equal(
			new Uint8Array([0xfb, 0xff]).toBase64({ alphabet: 'base64url', omitPadding: true }),
			'-_8'
		);
	});
});

// ── Empty input ───────────────────────────────────────────────────────────────

describe('empty Uint8Array', () => {
	it('returns an empty string', () => {
		assert.equal(new Uint8Array(0).toBase64(), '');
	});

	it('returns an empty string with all options set', () => {
		assert.equal(
			new Uint8Array(0).toBase64({ alphabet: 'base64url', omitPadding: true }),
			''
		);
	});
});

// ── Output integrity ──────────────────────────────────────────────────────────

describe('output integrity', () => {
	it('output length is always a multiple of 4 when padding is kept', () => {
		for (let len = 0; len <= 16; len++) {
			const encoded = new Uint8Array(len).toBase64();
			assert.equal(encoded.length % 4, 0, `length ${len} → '${encoded}'`);
		}
	});

	it('only contains valid base64 characters', () => {
		const valid = /^[A-Za-z0-9+/=]*$/;
		const all = new Uint8Array(256).map((_, i) => i);
		assert.match(all.toBase64(), valid);
	});

	it('only contains valid base64url characters', () => {
		const valid = /^[A-Za-z0-9\-_=]*$/;
		const all = new Uint8Array(256).map((_, i) => i);
		assert.match(all.toBase64({ alphabet: 'base64url' }), valid);
	});
});
