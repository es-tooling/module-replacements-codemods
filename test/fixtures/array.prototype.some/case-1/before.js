var some = require('array.prototype.some');
var assert = require('assert');

var a = [1, 2, 3];
assert.equal(
    true,
    some(a, function (x) {
        return x === 2;
    }),
);
assert.equal(
    false,
    some(a, function (x) {
        return x === 4;
    }),
);
