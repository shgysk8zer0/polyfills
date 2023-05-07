import { callOnce } from './utility.js';

export const getHTTPCSP = callOnce(async function getHTTPCSP() {
	const { ok, headers } = await fetch(location.href, { method: 'HEAD' });

	if (ok && headers.has('Content-Security-Policy')) {
		const directives = headers.get('Content-Security-Policy').trim().split(';').filter(str => str.length !== 0);

		return Object.fromEntries(directives.map(directive => {
			const [key, ...rest] = directive.trim().split(' ').filter(part => part.length !== 0);
			return [key, rest];
		}));
	}
});

export function getMetaCSP() {
	const meta = document.head.querySelector('meta[http-equiv="Content-Security-Policy"][content]');

	if (meta instanceof HTMLMetaElement) {
		const directives = meta.content.trim().split(';').filter(str => str.length !== 0);

		return Object.fromEntries(directives.map(directive => {
			const [key, ...rest] = directive.trim().split(' ').filter(part => part.length !== 0);
			return [key, rest];
		}));
	} else {
		return {};
	}
}
