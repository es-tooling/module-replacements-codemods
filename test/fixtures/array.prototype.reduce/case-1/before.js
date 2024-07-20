var reduce = require("array.prototype.reduce");
var assert = require("assert");

assert.equal(
  reduce([1, 2, 3], function (prev, x) {
    return prev + x;
  }),
  6,
);
assert.equal(
  reduce(
    [1, 2, 3],
    function (prev, x) {
      return prev + x;
    },
    1,
  ),
  7,
);
