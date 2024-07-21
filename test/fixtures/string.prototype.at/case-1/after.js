var assert = require("assert");

var str = "The quick brown fox jumps over the lazy dog.";

assert.equal(str.at(0), "T");
assert.equal(str.at(-1), ".");
