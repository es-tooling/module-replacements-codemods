var uncPathRegex = require("unc-path-regex");
var assert = require("assert");

var regex = uncPathRegex();

assert.equal(regex.test("\\\\foo\\bar"), true);
assert.equal(uncPathRegex().test("//foo/bar"), true);
assert.equal(uncPathRegex().test("/foo/bar"), false);
assert.equal(uncPathRegex().test("c:\\foo\\bar"), false);
