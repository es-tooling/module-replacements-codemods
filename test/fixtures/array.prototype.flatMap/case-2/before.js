import flatMap from 'array.prototype.flatMap';
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
