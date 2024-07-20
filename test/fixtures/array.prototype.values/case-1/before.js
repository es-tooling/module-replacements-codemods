var values = require("array.prototype.values");
var assert = require("assert");

assert.deepStrictEqual(Array.from(values([1, 2, 3])), [1, 2, 3]);
