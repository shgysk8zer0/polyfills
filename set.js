/**
 * @see https://github.com/tc39/proposal-set-methods
 */
'use strict';

const TYPE_ERR_MSG = 'Expected a set-like object.';
const SET_METHODS = ['has', 'keys'];
const SET_PROPS = ['size'];
const isSet = thing => thing instanceof Set;
const isSetLike = thing => isSet(thing) || (
	typeof thing === 'object'
	&& thing !==  null
	&& SET_METHODS.every(method => thing[method] instanceof Function)
	&& SET_PROPS.every(prop => prop in thing)
);

if (! (Set.prototype.intersection instanceof Function)) {
	Set.prototype.intersection = function intersection(set) {
		if (! isSetLike(set)) {
			throw new TypeError(TYPE_ERR_MSG);
		}

		return new Set([...this].filter(item => set.has(item)));
	};
}

if (! (Set.prototype.difference instanceof Function)) {
	Set.prototype.difference = function difference(set) {
		if (! isSetLike(set)) {
			throw new TypeError(TYPE_ERR_MSG);
		}

		return new Set([...this].filter(item => ! set.has(item)));
	};
}

if (! (Set.prototype.union instanceof Function)) {
	Set.prototype.union = function union(set) {
		return new Set([...this, ...set]);
	};
}

if (! (Set.prototype.isSubsetOf instanceof Function)) {
	Set.prototype.isSubsetOf = function isSubsetOf(set) {
		if (! isSetLike(set)) {
			throw new TypeError(TYPE_ERR_MSG);
		}

		return [...this].every(item => set.has(item));
	};
}

if (! (Set.prototype.isSupersetOf instanceof Function)) {
	Set.prototype.isSupersetOf = function isSupersetOf(set) {
		if (! isSetLike(set)) {
			throw new TypeError(TYPE_ERR_MSG);
		}

		// @TODO Handle when `set` is set-like
		return isSet(set)
			? set.isSubsetOf(this)
			: new Set(set.keys()).isSubsetOf(this);
	};
}

if (! (Set.prototype.symmetricDifference instanceof Function)) {
	Set.prototype.symmetricDifference = function symmetricDifference(set) {
		if (! isSetLike(set)) {
			throw new TypeError(TYPE_ERR_MSG);
		}

		// @TODO Handle when `set` is set-like
		return isSet(set)
			? new Set([...this.difference(set), ...set.difference(this)])
			: new Set([...this.difference(set), ...new Set(set.keys()).difference(this)]);
	};
}

if (! (Set.prototype.isDisjointFrom instanceof Function)) {
	Set.prototype.isDisjointFrom = function isDisjointFrom(set) {
		if (! isSetLike(set)) {
			throw new TypeError(TYPE_ERR_MSG);
		}

		return new Set([...this, ...set]).size === this.size + set.size;
	};
}
