var keys = require("array.prototype.keys");
var assert = require("assert");

assert.deepStrictEqual(Array.from(keys([1, 2, 3])), [0, 1, 2]);
