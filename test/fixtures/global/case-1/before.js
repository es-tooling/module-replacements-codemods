var global = require("global");
var assert = require("assert");

a = 42;
assert.equal(a, 42);
assert.equal(global.a, 42);

global.b = 43;
assert.equal(b, 43);
assert.equal(global.b, 43);