var assert = require('assert');
import banana from 'string.prototype.substr';

assert(banana('abc', 1) === 'bc');

var str = 'abc';
assert(banana(str, 1) === 'bc');
