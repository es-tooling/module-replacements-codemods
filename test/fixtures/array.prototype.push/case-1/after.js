var assert = require("assert");

var a = [1, 1, 1];
assert.equal(a.push(1, 2), 5);
assert.deepEqual(a, [1, 1, 1, 1, 2]);
