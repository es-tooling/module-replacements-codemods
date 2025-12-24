var assert = require('assert');

assert(Symbol('foo').description === Symbol('foo').description);
assert(Symbol().description === Symbol().description);
assert(Symbol(undefined).description === Symbol(undefined).description);
assert(Symbol(null).description === Symbol(null).description);