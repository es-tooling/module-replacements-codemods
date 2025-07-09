const slice = require("arraybuffer.prototype.slice");

const buffer = new ArrayBuffer(16);

new Int32Array(slice(buffer, 4, 12));
new Int32Array(slice(buffer, -2));
new Int32Array(slice(new ArrayBuffer(16), -2));
