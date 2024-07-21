import findIndex from 'array.prototype.findindex';
var assert = require('assert');

assert.deepEqual(
  findIndex([1, 2, 3], function (x) {
    return x >= 2;
  }),
  [2, 3],
);
assert.deepEqual(
  findIndex([1, 2, 3], function (x) {
    return x <= 2;
  }),
  [1, 2],
);
