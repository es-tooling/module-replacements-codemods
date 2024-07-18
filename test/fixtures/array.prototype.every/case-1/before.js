var every = require("array.prototype.every");
var assert = require("assert");

assert.equal(
  true,
  every([1, 1, 1], function (x) {
    return x === 1;
  }),
);
assert.equal(
  false,
  every([1, 0, 1], function (x) {
    return x === 1;
  }),
);
