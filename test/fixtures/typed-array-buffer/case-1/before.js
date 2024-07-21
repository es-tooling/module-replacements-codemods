const typedArrayBuffer = require("typed-array-buffer");

const int8Array = new Int8Array(0);
console.log(typedArrayBuffer(int8Array));
console.log(typedArrayBuffer(new Int8Array(0)));

const uint8Array = new Uint8Array(0);
console.log(typedArrayBuffer(uint8Array));
console.log(typedArrayBuffer(new Uint8Array(0)));

const uint8ClampedArray = new Uint8ClampedArray(0);
console.log(typedArrayBuffer(uint8ClampedArray));
console.log(typedArrayBuffer(new Uint8ClampedArray(0)));

const int16Array = new Int16Array(0);
console.log(typedArrayBuffer(int16Array));
console.log(typedArrayBuffer(new Int16Array(0)));

const uint16Array = new Uint16Array(0);
console.log(typedArrayBuffer(uint16Array));
console.log(typedArrayBuffer(new Uint16Array(0)));

const int32Array = new Int32Array(0);
console.log(typedArrayBuffer(int32Array));
console.log(typedArrayBuffer(new Int32Array(0)));

const uint32Array = new Uint32Array(0);
console.log(typedArrayBuffer(uint32Array));
console.log(typedArrayBuffer(new Uint32Array(0)));

const float16Array = new Float16Array(0);
console.log(typedArrayBuffer(float16Array));
console.log(typedArrayBuffer(new Float16Array(0)));

const float32Array = new Float32Array(0);
console.log(typedArrayBuffer(float32Array));
console.log(typedArrayBuffer(new Float32Array(0)));

const float64Array = new Float64Array(0);
console.log(typedArrayBuffer(float64Array));
console.log(typedArrayBuffer(new Float64Array(0)));

const bigInt64Array = new BigInt64Array(0);
console.log(typedArrayBuffer(bigInt64Array));
console.log(typedArrayBuffer(new BigInt64Array(0)));

const bigUint64Array = new BigUint64Array(0);
console.log(typedArrayBuffer(bigUint64Array));
console.log(typedArrayBuffer(new BigUint64Array(0)));
