var assert = require('assert');

var a = [1, 2, 3];
assert.equal(
    true,
    a.some(function (x) {
        return x === 2;
    }),
);
assert.equal(
    false,
    a.some(function (x) {
        return x === 4;
    }),
);
