if (! (Object.groupBy instanceof Function)) {
	Object.groupBy = function(items, callbackFn) {
		return Array.from(items).reduce((groups, element, index) => {
			const key = callbackFn.call(groups, element, index);

			if (! groups.hasOwnProperty(key)) {
				groups[key] = [element];
			} else {
				groups[key].push(element);
			}

			return groups;
		}, {});
	};
}
