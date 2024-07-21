import dataViewBuffer from 'data-view-buffer';
import assert from 'assert';

const buffer = new ArrayBuffer(123);
const view = new DataView(buffer);
assert.equal(dataViewBuffer(view), buffer);