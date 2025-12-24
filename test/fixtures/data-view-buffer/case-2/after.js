import assert from 'assert';

const buffer = new ArrayBuffer(123);
const view = new DataView(buffer);
assert.equal(view.buffer, buffer);