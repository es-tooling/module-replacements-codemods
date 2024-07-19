import forEach from 'array.prototype.forEach';
var assert = require('assert');

assert.deepEqual(
  forEach([1, 2, 3], function (x) {
    return x >= 2;
  }),
  [2, 3],
);
assert.deepEqual(
  forEach([1, 2, 3], function (x) {
    return x <= 2;
  }),
  [1, 2],
);
