const assert = require("assert");
const Base = require("es-errors");
const Eval = require("es-errors/eval");
const Range = require("es-errors/range");
const Ref = require("es-errors/ref");
const Syntax = require("es-errors/syntax");
const Type = require("es-errors/type");
const URI = require("es-errors/uri");

const baseError = new Base();
const evalError = new Eval();
const rangeError = new Range();
const refError = new Ref();
const syntaxError = new Syntax();
const typeError = new Type();
const uriError = new URI();

assert.equal(baseError instanceof Error, true);
assert.equal(evalError instanceof EvalError, true);
assert.equal(rangeError instanceof RangeError, true);
assert.equal(refError instanceof ReferenceError, true);
assert.equal(syntaxError instanceof SyntaxError, true);
assert.equal(typeError instanceof TypeError, true);
assert.equal(uriError instanceof URIError, true);
