var assert = require("assert");

const input = "foo";
const expected = "foofoofoo";

assert.equal(input.repeat(3), expected);
