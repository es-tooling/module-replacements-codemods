var assert = require('assert');

assert(/a/.flags === '');
assert(new RegExp('a').flags === '');
assert(/a/mig.flags === 'gim');
assert(new RegExp('a', 'mig').flags === 'gim');