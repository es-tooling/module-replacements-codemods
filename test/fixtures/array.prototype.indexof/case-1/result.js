var assert = require("assert");

assert.equal([1, 2, 3].indexOf(2), 1);
assert.equal([1, 0, 1].indexOf(1), 0);
assert.equal([1, 2, 3].indexOf(4), -1);
assert.equal([NaN].indexOf(NaN), -1);
