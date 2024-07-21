var padEnd = require("string.prototype.padend");
var assert = require("assert");

assert.equal(padEnd("foo", 5, "bar"), "fooba");
