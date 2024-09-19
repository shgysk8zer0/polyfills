
if (! (RegExp.escape instanceof Function)) {
	const pattern = /[-[\]/{}()<>=#&!@%*+?.\\^$|;:"'`\s]/g;

	RegExp.escape = function(input) {
		return input.toString().replace(pattern, '\\$&');
	};
}
