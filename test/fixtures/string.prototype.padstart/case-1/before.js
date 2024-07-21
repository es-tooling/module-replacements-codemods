var padStart = require("string.prototype.padstart");
var assert = require("assert");

assert(padStart("foo", 5, "bar") === "bafoo");
