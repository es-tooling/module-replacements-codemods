const slice = require("arraybuffer.prototype.slice");

const buffer = new ArrayBuffer(16);

const sliced1 = new Int32Array(slice(buffer, 4, 12));
const sliced2 = new Int32Array(slice(buffer, -2));
const sliced3 = new Int32Array(slice(new ArrayBuffer(16), -2));
