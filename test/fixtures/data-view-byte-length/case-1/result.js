const assert = require('assert');

const buffer = new ArrayBuffer(42);
const view = new DataView(buffer);
assert.equal(view.byteLength, 42);