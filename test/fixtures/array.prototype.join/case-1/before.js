var join = require("array.prototype.join");
var assert = require("assert");

var a = [1, 1, 1];
assert.deepEqual(join(a, "x"), "1x1x1");
