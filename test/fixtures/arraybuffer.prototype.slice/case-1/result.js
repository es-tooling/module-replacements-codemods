const buffer = new ArrayBuffer(16);

const sliced1 = new Int32Array(buffer.slice(4, 12));
const sliced2 = new Int32Array(buffer.slice(-2));
const sliced3 = new Int32Array(new ArrayBuffer(16).slice(-2));
