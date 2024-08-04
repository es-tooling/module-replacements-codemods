var assert = require("assert");

a = 42;
assert.equal(a, 42);
assert.equal(globalThis.a, 42);

globalThis.b = 43;
assert.equal(b, 43);
assert.equal(globalThis.b, 43);