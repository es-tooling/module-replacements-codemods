var assert = require('assert');

assert(/a/.flags === /a/.flags);
assert(new RegExp('a').flags === new RegExp('a').flags);
assert(/a/mig.flags === /a/mig.flags);
assert(new RegExp('a', 'mig').flags === new RegExp('a', 'mig').flags);