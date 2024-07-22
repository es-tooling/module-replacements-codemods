const dataViewByteOffset = require('data-view-byte-offset');
const assert = require('assert');

const buffer = new ArrayBuffer(42);
const view = new DataView(buffer, 2);
assert.equal(dataViewByteOffset(view), 2);