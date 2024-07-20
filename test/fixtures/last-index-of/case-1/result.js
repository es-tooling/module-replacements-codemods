var assert = require("assert");

assert.equal(["a", "b", "c", "a", "b", "c"].lastIndexOf("a"), 3);
assert.equal(["a", "b", "c"].lastIndexOf("d"), -1);
assert.equal(["a", "b", "a", "b", "a", "b"].lastIndexOf("b", 3), 3);
