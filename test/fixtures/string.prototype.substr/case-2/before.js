var assert = require('assert');
var substr = require('string.prototype.substr');

assert(substr('abc', 1) === 'bc');

var str = 'abc';
assert(substr(str, 1) === 'bc');
