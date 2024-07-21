var leftPad = require("pad-left");
var assert = require("assert");

assert.equal(leftPad("foo", 5), "foo  ");

assert.equal(leftPad("foobar", 6), "foobar");

assert.equal(leftPad(1, 2, "0"), "01");

assert.equal(leftPad(17, 5, 0), "00017");
