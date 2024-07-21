var trimStart = require("string.prototype.trimstart");
var assert = require("assert");

assert(trimStart(" \t\na \t\n") === "a \t\n");
