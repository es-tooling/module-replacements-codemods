var flags = require('regexp.prototype.flags');
var assert = require('assert');

assert(flags(/a/) === '');
assert(flags(new RegExp('a')) === '');
assert(flags(/a/mig) === 'gim');
assert(flags(new RegExp('a', 'mig')) === 'gim');