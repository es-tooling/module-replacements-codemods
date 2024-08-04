var assign = require('object.assign').getPolyfill();
var assert = require('assert');

var target = { a: true };
var source1 = { b: true };
var source2 = { c: true };
assign(target, source1, source2);

var expected = {
    a: true,
    b: true,
    c: true,
};
assert.deepEqual(target, expected);