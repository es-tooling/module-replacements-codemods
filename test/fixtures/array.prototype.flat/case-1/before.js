var flat = require('array.prototype.flat');
var assert = require('assert');

assert.deepEqual(
  flat([1, 2, 3], function (x) {
    return x >= 2;
  }),
  [2, 3],
);
assert.deepEqual(
  flat([1, 2, 3], function (x) {
    return x <= 2;
  }),
  [1, 2],
);
