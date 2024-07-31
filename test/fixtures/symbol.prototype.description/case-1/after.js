var assert = require('assert');

assert(Symbol('foo').description === 'foo');
assert(Symbol().description === undefined);
assert(Symbol(undefined).description === undefined);
assert(Symbol(null).description === 'null');