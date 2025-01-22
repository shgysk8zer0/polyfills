import { polyfillMethod } from './utils.js';

polyfillMethod(ReadableStream, 'from', function from(anyIterable) {
	if (anyIterable[Symbol.iterator] instanceof Function) {
		return new ReadableStream({
			start(controller) {
				try {
					for (const chunk of anyIterable) {
						controller.enqueue(chunk);
					}
				} catch(err) {
					controller.error(err);
				} finally {
					controller.close();
				}
			}
		});
	} else if (anyIterable[Symbol.asyncIterator] instanceof Function) {
		return new ReadableStream({
			async start(controller) {
				try {
					for await (const chunk of anyIterable) {
						controller.enqueue(chunk);
					}
				} catch(err) {
					controller.error(err);
				} finally {
					controller.close();
				}
			}
		});
	} else {
		throw new TypeError('`ReadableStream.from()` requires an iterable source.');
	}
});
