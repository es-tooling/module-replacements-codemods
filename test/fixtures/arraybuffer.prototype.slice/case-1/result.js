const buffer = new ArrayBuffer(16);

new Int32Array(buffer.slice(4, 12));
new Int32Array(buffer.slice(-2));
new Int32Array(new ArrayBuffer(16).slice(-2));
