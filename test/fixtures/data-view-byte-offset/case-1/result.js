const assert = require('assert');

const buffer = new ArrayBuffer(42);
const view = new DataView(buffer, 2);
assert.equal(view.byteOffset, 2);