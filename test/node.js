import '@shgysk8zer0/polyfills';

async function test(toRun) {
	try {
		await toRun();
		return true;
	} catch(err) {
		return err;
	}
}

function testSymbols() {
	if (! Symbol.isWellKnown(Symbol.iterator)) {
		throw new Error('Symbol.iterator should be a well-known symbol.');
	} else if (Symbol.isRegistered(Symbol('dne-djkfgbodkgj'))) {
		throw new Error('User-defined symbols should not be well-known.');
	} else if (Symbol.isRegistered(Symbol('foo'))) {
		throw new Error('Symbols created via `Symbol()` should not be registered.');
	} else if (! Symbol.isRegistered(Symbol.for('foo'))) {
		throw new Error('Symbols created via `Symbol.for()` should be registered.');
	}
}

function testIterator() {
	const sum = Iterator.range(1, 100, { inclusive: true }).reduce((sum, num) => sum + num);

	if (sum !== 5050) {
		throw new Error(`Expected sum from 1-100 to be 5050 but got ${sum}.`);
	}
}

function testSet() {
	const evens = new Set(Iterator.range(0, 100, { step: 2 }));
	const odds = new Set(Iterator.range(1, 100, { step: 2 }));
	const nums = new Set(Iterator.range(0, 100));
	const union = odds.union(evens);
	const diff = nums.symmetricDifference(union);

	if (diff.size !== 0) {
		throw new Error('Union of evens with odds should result in all integers.');
	} else if (! (odds.isSubsetOf(nums) && evens.isSubsetOf(union))) {
		throw new Error('Odds and evens should be subsets of all numbers.');
	} else if (! odds.isDisjointFrom(evens)) {
		throw new Error('Odds and evens should be disjoint sets.');
	}
}

async function testMap() {
	const events = await fetch(URL.parse('./events.json', 'https://events.kernvalley.us')).then(resp => resp.json());

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

	if (! map.has(key)) {
		throw new Error(`Map does not contain entry for Symbol(${strKey}).`);
	} else if (map.get(key).length === len) {
		throw new Error(`Failed to update and append map for Symbol(${strKey}).`);
	}
}

async function testBlobs() {
	const message = 'Hello, World!';
	const alphabet = 'base64';
	const blob = new Blob([message], { type: 'text/plain' });
	const bytes = await blob.bytes();
	const encoded = bytes.toBase64({ alphabet });

	if (encoded !== 'SGVsbG8sIFdvcmxkIQ==') {
		throw new Error('Expected base64 encoding to result in "SGVsbG8sIFdvcmxkIQ==".');
	} else if ( new TextDecoder().decode(Uint8Array.fromBase64(encoded, { alphabet })) !== message) {
		throw new Error('Expected decoded message to be identical to original.');
	}

}

async function testSchedulerAndOnce() {
	const cachedNow = (() => ({ date: Date.now() })).once();
	const first = cachedNow();
	await scheduler.postTask(() => undefined, { delay: 200 });
	const second = cachedNow();

	if (first !== second) {
		throw new Error('Results from `Function.once` should be cached.');
	}
}

const results = await Promise.fromEntries([
	['Iterator', test(testIterator)],
	['Set', test(testSet)],
	['Blobs', test(testBlobs)],
	['SchedulerAndOnce', test(testSchedulerAndOnce)],
	['Map', test(testMap)],
	['Symbols', test(testSymbols)],
]);

const errs = Object
	.entries(results)
	.filter((result) => result[1] instanceof Error)
	.map(([name, err]) => new Error(`Failed test ${name}`, { cause: err }));


if (errs.length !== 0) {
	throw new AggregateError(errs, 'Some tests did not pass.');
}
