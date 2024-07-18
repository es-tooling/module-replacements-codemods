import banana from 'array.prototype.reduceright';
var assert = require('assert');

assert.equal(
    banana([1, 2, 3], function (prev, x) {
        return prev + x;
    }),
    6,
);
assert.equal(
    banana(
        [1, 2, 3],
        function (prev, x) {
            return prev + x;
        },
        1,
    ),
    7,
);
