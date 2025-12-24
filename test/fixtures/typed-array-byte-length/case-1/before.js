const typedArrayByteLength = require("typed-array-byte-length");

const int8Array = new Int8Array(0);
console.log(typedArrayByteLength(int8Array));
console.log(typedArrayByteLength(new Int8Array(0)));

const uint8Array = new Uint8Array(0);
console.log(typedArrayByteLength(uint8Array));
console.log(typedArrayByteLength(new Uint8Array(0)));

const uint8ClampedArray = new Uint8ClampedArray(0);
console.log(typedArrayByteLength(uint8ClampedArray));
console.log(typedArrayByteLength(new Uint8ClampedArray(0)));

const int16Array = new Int16Array(0);
console.log(typedArrayByteLength(int16Array));
console.log(typedArrayByteLength(new Int16Array(0)));

const uint16Array = new Uint16Array(0);
console.log(typedArrayByteLength(uint16Array));
console.log(typedArrayByteLength(new Uint16Array(0)));

const int32Array = new Int32Array(0);
console.log(typedArrayByteLength(int32Array));
console.log(typedArrayByteLength(new Int32Array(0)));

const uint32Array = new Uint32Array(0);
console.log(typedArrayByteLength(uint32Array));
console.log(typedArrayByteLength(new Uint32Array(0)));

const float16Array = new Float16Array(0);
console.log(typedArrayByteLength(float16Array));
console.log(typedArrayByteLength(new Float16Array(0)));

const float32Array = new Float32Array(0);
console.log(typedArrayByteLength(float32Array));
console.log(typedArrayByteLength(new Float32Array(0)));

const float64Array = new Float64Array(0);
console.log(typedArrayByteLength(float64Array));
console.log(typedArrayByteLength(new Float64Array(0)));

const bigInt64Array = new BigInt64Array(0);
console.log(typedArrayByteLength(bigInt64Array));
console.log(typedArrayByteLength(new BigInt64Array(0)));

const bigUint64Array = new BigUint64Array(0);
console.log(typedArrayByteLength(bigUint64Array));
console.log(typedArrayByteLength(new BigUint64Array(0)));
