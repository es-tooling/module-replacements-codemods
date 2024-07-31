var flags = require('regexp.prototype.flags');
var assert = require('assert');

flags.shim();
assert(flags(/a/) === /a/.flags);
assert(flags(new RegExp('a')) === new RegExp('a').flags);
assert(flags(/a/mig) === /a/mig.flags);
assert(flags(new RegExp('a', 'mig')) === new RegExp('a', 'mig').flags);