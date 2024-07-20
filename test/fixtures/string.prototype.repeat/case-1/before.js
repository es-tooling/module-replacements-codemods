var repeat = require("string.prototype.repeat");
var assert = require("assert");

const input = "foo";
const expected = "foofoofoo";

assert.equal(repeat(input, 3), expected);
