var description = require('symbol.prototype.description');
var assert = require('assert');

assert(description(Symbol('foo')) === 'foo');
assert(description(Symbol()) === undefined);
assert(description(Symbol(undefined)) === undefined);
assert(description(Symbol(null)) === 'null');