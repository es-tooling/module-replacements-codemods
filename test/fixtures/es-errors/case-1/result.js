const assert = require("assert");

const baseError = new Error();
const evalError = new EvalError();
const rangeError = new RangeError();
const refError = new ReferenceError();
const syntaxError = new SyntaxError();
const typeError = new TypeError();
const uriError = new URIError();

assert.equal(baseError instanceof Error, true);
assert.equal(evalError instanceof EvalError, true);
assert.equal(rangeError instanceof RangeError, true);
assert.equal(refError instanceof ReferenceError, true);
assert.equal(syntaxError instanceof SyntaxError, true);
assert.equal(typeError instanceof TypeError, true);
assert.equal(uriError instanceof URIError, true);
