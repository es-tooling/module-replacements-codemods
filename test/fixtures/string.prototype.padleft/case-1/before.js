var padLeft = require("string.prototype.padleft");
var assert = require("assert");

assert(padLeft("foo", 5, "bar") === "bafoo");
