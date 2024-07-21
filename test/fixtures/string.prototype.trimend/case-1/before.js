var trimEnd = require("string.prototype.trimend");
var assert = require("assert");

assert(trimEnd(" \t\na \t\n") === " \t\na");
