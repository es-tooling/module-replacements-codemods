
var assert = require("assert");

var regex = /^[\\\/]{2,}[^\\\/]+[\\\/]+[^\\\/]+/;

assert.equal(regex.test("\\\\foo\\bar"), true);
assert.equal(/^[\\\/]{2,}[^\\\/]+[\\\/]+[^\\\/]+/.test("//foo/bar"), true);
assert.equal(/^[\\\/]{2,}[^\\\/]+[\\\/]+[^\\\/]+/.test("/foo/bar"), false);
assert.equal(/^[\\\/]{2,}[^\\\/]+[\\\/]+[^\\\/]+/.test("c:\\foo\\bar"), false);
