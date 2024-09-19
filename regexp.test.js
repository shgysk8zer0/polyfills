import { describe, test } from 'node:test';
import assert from 'node:assert';
import '@shgysk8zer0/polyfills/regexp';
const signal = AbortSignal.timeout(30_000);

const expected = {
	'The Quick Brown Fox': 'The\\ Quick\\ Brown\\ Fox',
	'Buy it. use it. break it. fix it.': 'Buy\\ it\\.\\ use\\ it\\.\\ break\\ it\\.\\ fix\\ it\\.',
	'(*.*)': '\\(\\*\\.\\*\\)',
	'｡^･ｪ･^｡': '｡\\^･ｪ･\\^｡',
	'😊 *_* +_+ ... 👍': '😊\\ \\*_\\*\\ \\+_\\+\\ \\.\\.\\.\\ 👍',
	'\\d \\D (?:)': '\\\\d\\ \\\\D\\ \\(\\?\\:\\)',
};

describe('Test `RegExp.escape`', () => {
	test('`RegExp.escape` matches examples', { signal }, () => {

		for (const [source, pattern] of Object.entries(expected)) {
			assert.equal(RegExp.escape(source), pattern, `'${source}' should escape to '${pattern}'.`);
		}
	});

	test('`RegExp.escape` inputs match the patterns they create', { signal }, () => {
		const inputs = [
			'https://example.com:8080/path?q=search&t=0#hash',
			'{}[]\\|<>,./?~!@#$%^&*()_`-=',
			...Object.keys(expected),
			new TextDecoder().decode(crypto.getRandomValues(new Uint8Array(20))),
		];

		inputs.forEach(input => {
			const pattern = RegExp.escape(input);
			const regex = new RegExp(pattern);
			assert.ok(regex.test(input), `${input} should match /${pattern}/`);
		});
	});
});
