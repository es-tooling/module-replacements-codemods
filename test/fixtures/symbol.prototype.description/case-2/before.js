var description = require('symbol.prototype.description');
var assert = require('assert');

description.shim();
assert(description(Symbol('foo')) === Symbol('foo').description);
assert(description(Symbol()) === Symbol().description);
assert(description(Symbol(undefined)) === Symbol(undefined).description);
assert(description(Symbol(null)) === Symbol(null).description);