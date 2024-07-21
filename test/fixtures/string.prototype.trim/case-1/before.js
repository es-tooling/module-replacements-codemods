var assert = require("assert");
var trim = require("string.prototype.trim");

assert(trim(" \t\na \t\n") === "a");
