var objectIs = require("object-is");
var assert = require("assert");

assert.ok(objectIs());
assert.ok(objectIs(undefined));
assert.ok(objectIs(undefined, undefined));
assert.ok(objectIs(null, null));
assert.ok(objectIs(true, true));
assert.ok(objectIs(false, false));
assert.ok(objectIs("foo", "foo"));

var arr = [1, 2];
assert.ok(objectIs(arr, arr));
assert.equal(objectIs(arr, [1, 2]), false);

assert.ok(objectIs(0, 0));
assert.ok(objectIs(-0, -0));
assert.equal(objectIs(0, -0), false);

assert.ok(objectIs(NaN, NaN));
assert.ok(objectIs(Infinity, Infinity));
assert.ok(objectIs(-Infinity, -Infinity));
