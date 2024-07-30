const assert = require('assert');
const shimUnscopables = require('es-shim-unscopables');

let includes;
assert.notEqual(includes, Array.prototype.includes);
shimUnscopables('includes');
assert.notEqual(includes, Array.prototype.includes);