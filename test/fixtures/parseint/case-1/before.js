var assert = require('assert');
var banana = require('parseint');

assert.equal(banana('-3'), -3);
assert.equal(banana('0x10'), 16);
assert.equal(banana('30', 7), 21);
assert.equal(banana('ef'), NaN);
