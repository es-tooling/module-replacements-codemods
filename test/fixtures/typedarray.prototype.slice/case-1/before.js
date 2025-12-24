const slice = require("typedarray.prototype.slice");

const int8Array = new Int8Array(16);
console.log(slice(int8Array, 4, 12));
console.log(slice(int8Array, -2));
console.log(slice(new Int8Array(16), -2));

const uint8Array = new Uint8Array(16);
console.log(slice(uint8Array, 4, 12));
console.log(slice(uint8Array, -2));
console.log(slice(new Uint8Array(16), -2));

const uint8ClampedArray = new Uint8ClampedArray(16);
console.log(slice(uint8ClampedArray, 4, 12));
console.log(slice(uint8ClampedArray, -2));
console.log(slice(new Uint8ClampedArray(16), -2));

const int16Array = new Int16Array(16);
console.log(slice(int16Array, 4, 12));
console.log(slice(int16Array, -2));
console.log(slice(new Int16Array(16), -2));

const uint16Array = new Uint16Array(16);
console.log(slice(uint16Array, 4, 12));
console.log(slice(uint16Array, -2));
console.log(slice(new Uint16Array(16), -2));

const int32Array = new Int32Array(16);
console.log(slice(int32Array, 4, 12));
console.log(slice(int32Array, -2));
console.log(slice(new Int32Array(16), -2));

const uint32Array = new Uint32Array(16);
console.log(slice(uint32Array, 4, 12));
console.log(slice(uint32Array, -2));
console.log(slice(new Uint32Array(16), -2));

const float16Array = new Float16Array(16);
console.log(slice(float16Array, 4, 12));
console.log(slice(float16Array, -2));
console.log(slice(new Float16Array(16), -2));

const float32Array = new Float32Array(16);
console.log(slice(float32Array, 4, 12));
console.log(slice(float32Array, -2));
console.log(slice(new Float32Array(16), -2));

const float64Array = new Float64Array(16);
console.log(slice(float64Array, 4, 12));
console.log(slice(float64Array, -2));
console.log(slice(new Float64Array(16), -2));

const bigInt64Array = new BigInt64Array(16);
console.log(slice(bigInt64Array, 4, 12));
console.log(slice(bigInt64Array, -2));
console.log(slice(new BigInt64Array(16), -2));

const bigUint64Array = new BigUint64Array(16);
console.log(slice(bigUint64Array, 4, 12));
console.log(slice(bigUint64Array, -2));
console.log(slice(new BigUint64Array(16), -2));
