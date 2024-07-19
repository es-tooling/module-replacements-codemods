var concat = require("array.prototype.concat");
var assert = require("assert");

assert.equal(
  true,
  concat([1, 1, 1], function (x) {
    return x === 1;
  }),
);
assert.equal(
  false,
  concat([1, 0, 1], function (x) {
    return x === 1;
  }),
);
