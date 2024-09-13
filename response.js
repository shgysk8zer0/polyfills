import { polyfillMethod } from './utils.js';

polyfillMethod(Response, 'json', (data, { status = 200, statusText = '', headers = new Headers() } = {}) => {
	if (! (headers instanceof Headers)) {
		return Response.json(data, { status, statusText, headers: new Headers(headers) });
	} else {
		headers.set('Content-Type', 'application/json');
		return new Response(JSON.stringify(data), { status, statusText, headers });
	}
});

polyfillMethod(Response, 'redirect', (url, status = 302) => {
	return new Response(null, {
		status,
		headers: new Headers({ Location: url }),
	});
});

polyfillMethod(Response.prototype, 'bytes', async function() {
	return new Uint8Array(await this.arrayBuffer());
});
