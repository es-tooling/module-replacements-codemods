import flatMap from 'array.prototype.flatmap';
var assert = require('assert');

assert.deepEqual(
  flatMap([1, 2, 3], function (x) {
    return x >= 2;
  }),
  [2, 3],
);
assert.deepEqual(
  flatMap([1, 2, 3], function (x) {
    return x <= 2;
  }),
  [1, 2],
);
