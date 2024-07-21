const dataViewBuffer = require('data-view-buffer');
const assert = require('assert');

const buffer = new ArrayBuffer(123);
const view = new DataView(buffer);
assert.equal(dataViewBuffer(view), buffer);