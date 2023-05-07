export function errorToEvent(error, type = 'error') {
	if (error instanceof Error) {
		const { message, name, fileName: filename, lineNumber: lineno, columnNumber: colno } = error;
		return new ErrorEvent(type, { error, message: `${name}: ${message}`, filename, lineno, colno });
	} else {
		throw new TypeError('`errorToEvent()` only accepts Errors');
	}
}
