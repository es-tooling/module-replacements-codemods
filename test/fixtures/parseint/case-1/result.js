var assert = require('assert');

assert.equal(parseInt('-3'), -3);
assert.equal(parseInt('0x10'), 16);
assert.equal(parseInt('30', 7), 21);
assert.equal(parseInt('ef'), NaN);
