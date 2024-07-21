const typedArrayLength = require("typed-array-length");

const int8Array = new Int8Array(0);
console.log(typedArrayLength(int8Array));
console.log(typedArrayLength(new Int8Array(0)));

const uint8Array = new Uint8Array(0);
console.log(typedArrayLength(uint8Array));
console.log(typedArrayLength(new Uint8Array(0)));

const uint8ClampedArray = new Uint8ClampedArray(0);
console.log(typedArrayLength(uint8ClampedArray));
console.log(typedArrayLength(new Uint8ClampedArray(0)));

const int16Array = new Int16Array(0);
console.log(typedArrayLength(int16Array));
console.log(typedArrayLength(new Int16Array(0)));

const uint16Array = new Uint16Array(0);
console.log(typedArrayLength(uint16Array));
console.log(typedArrayLength(new Uint16Array(0)));

const int32Array = new Int32Array(0);
console.log(typedArrayLength(int32Array));
console.log(typedArrayLength(new Int32Array(0)));

const uint32Array = new Uint32Array(0);
console.log(typedArrayLength(uint32Array));
console.log(typedArrayLength(new Uint32Array(0)));

const float16Array = new Float16Array(0);
console.log(typedArrayLength(float16Array));
console.log(typedArrayLength(new Float16Array(0)));

const float32Array = new Float32Array(0);
console.log(typedArrayLength(float32Array));
console.log(typedArrayLength(new Float32Array(0)));

const float64Array = new Float64Array(0);
console.log(typedArrayLength(float64Array));
console.log(typedArrayLength(new Float64Array(0)));

const bigInt64Array = new BigInt64Array(0);
console.log(typedArrayLength(bigInt64Array));
console.log(typedArrayLength(new BigInt64Array(0)));

const bigUint64Array = new BigUint64Array(0);
console.log(typedArrayLength(bigUint64Array));
console.log(typedArrayLength(new BigUint64Array(0)));
