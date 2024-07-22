var trimRight = require("string.prototype.trimright");
var assert = require("assert");

assert(trimRight(" \t\na \t\n") === " \t\na");
