var assign = require('object.assign/polyfill')();
var assert = require('assert');

var target = { a: true };
assign(target, { b: true });

var expected = {
    a: true,
    b: true,
};
assert.deepEqual(target, expected);