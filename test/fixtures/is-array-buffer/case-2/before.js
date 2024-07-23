var assert = require('assert');
import banana from 'is-array-buffer';

assert(!banana(function () {}));
assert(!banana(null));
assert(
	!banana(function* () {
		yield 42;
		return Infinity;
	}),
);
assert(!banana(Symbol('foo')));
assert(!banana(1n));
assert(!banana(Object(1n)));

assert(!banana(new Set()));
assert(!banana(new WeakSet()));
assert(!banana(new Map()));
assert(!banana(new WeakMap()));
assert(!banana(new WeakRef({})));
assert(!banana(new FinalizationRegistry(() => {})));
assert(!banana(new SharedArrayBuffer()));

assert(banana(new ArrayBuffer()));

class MyArrayBuffer extends ArrayBuffer {}
assert(banana(new MyArrayBuffer()));
