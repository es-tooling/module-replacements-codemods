const dataViewByteLength = require('data-view-byte-length');
const assert = require('assert');

const buffer = new ArrayBuffer(42);
const view = new DataView(buffer);
assert.equal(dataViewByteLength(view), 42);