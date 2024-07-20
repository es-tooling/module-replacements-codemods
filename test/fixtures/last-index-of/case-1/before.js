var lastIndexOf = require("last-index-of");
var assert = require("assert");

assert.equal(lastIndexOf(["a", "b", "c", "a", "b", "c"], "a"), 3);
assert.equal(lastIndexOf(["a", "b", "c"], "d"), -1);
assert.equal(lastIndexOf(["a", "b", "a", "b", "a", "b"], "b", 3), 3);
