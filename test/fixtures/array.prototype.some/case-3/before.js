var banana = require('array.prototype.some');
var assert = require('assert');

var a = [1, 2, 3];
assert.equal(
    true,
    banana(a, function (x) {
        return x === 2;
    }),
);
assert.equal(
    false,
    banana(a, function (x) {
        return x === 4;
    }),
);
