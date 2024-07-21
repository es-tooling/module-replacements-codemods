var padRight = require("string.prototype.padright");
var assert = require("assert");

assert(padRight("foo", 5, "bar") === "fooba");
