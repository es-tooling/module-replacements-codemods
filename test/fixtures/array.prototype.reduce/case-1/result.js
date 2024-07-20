var assert = require("assert");

assert.equal(
  [1, 2, 3].reduce(function (prev, x) {
    return prev + x;
  }),
  6,
);
assert.equal(
  [1, 2, 3].reduce(function (prev, x) {
    return prev + x;
  }, 1),
  7,
);
