var trimLeft = require("string.prototype.trimleft");
var assert = require("assert");

assert(trimLeft(" \t\na \t\n") === "a \t\n");
