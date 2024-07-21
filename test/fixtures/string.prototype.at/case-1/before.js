var at = require("string.prototype.at");
var assert = require("assert");

var str = "The quick brown fox jumps over the lazy dog.";

assert.equal(at(str, 0), "T");
assert.equal(at(str, -1), ".");
