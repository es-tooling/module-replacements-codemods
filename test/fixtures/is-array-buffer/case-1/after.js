var assert = require('assert');

assert(!(function () {} instanceof ArrayBuffer));
assert(!(null instanceof ArrayBuffer));
assert(
	!(function* () {
		yield 42;
		return Infinity;
	} instanceof ArrayBuffer),
);
assert(!(Symbol('foo') instanceof ArrayBuffer));
assert(!(1n instanceof ArrayBuffer));
assert(!(Object(1n) instanceof ArrayBuffer));

assert(!(new Set() instanceof ArrayBuffer));
assert(!(new WeakSet() instanceof ArrayBuffer));
assert(!(new Map() instanceof ArrayBuffer));
assert(!(new WeakMap() instanceof ArrayBuffer));
assert(!(new WeakRef({}) instanceof ArrayBuffer));
assert(!(new FinalizationRegistry(() => {}) instanceof ArrayBuffer));
assert(!(new SharedArrayBuffer() instanceof ArrayBuffer));

assert((new ArrayBuffer() instanceof ArrayBuffer));

class MyArrayBuffer extends ArrayBuffer {}
assert((new MyArrayBuffer() instanceof ArrayBuffer));
