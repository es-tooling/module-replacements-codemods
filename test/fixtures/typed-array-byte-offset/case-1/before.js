const typedArrayByteOffset = require("typed-array-byte-offset");

const int8Array = new Int8Array(0);
console.log(typedArrayByteOffset(int8Array));
console.log(typedArrayByteOffset(new Int8Array(0)));

const uint8Array = new Uint8Array(0);
console.log(typedArrayByteOffset(uint8Array));
console.log(typedArrayByteOffset(new Uint8Array(0)));

const uint8ClampedArray = new Uint8ClampedArray(0);
console.log(typedArrayByteOffset(uint8ClampedArray));
console.log(typedArrayByteOffset(new Uint8ClampedArray(0)));

const int16Array = new Int16Array(0);
console.log(typedArrayByteOffset(int16Array));
console.log(typedArrayByteOffset(new Int16Array(0)));

const uint16Array = new Uint16Array(0);
console.log(typedArrayByteOffset(uint16Array));
console.log(typedArrayByteOffset(new Uint16Array(0)));

const int32Array = new Int32Array(0);
console.log(typedArrayByteOffset(int32Array));
console.log(typedArrayByteOffset(new Int32Array(0)));

const uint32Array = new Uint32Array(0);
console.log(typedArrayByteOffset(uint32Array));
console.log(typedArrayByteOffset(new Uint32Array(0)));

const float16Array = new Float16Array(0);
console.log(typedArrayByteOffset(float16Array));
console.log(typedArrayByteOffset(new Float16Array(0)));

const float32Array = new Float32Array(0);
console.log(typedArrayByteOffset(float32Array));
console.log(typedArrayByteOffset(new Float32Array(0)));

const float64Array = new Float64Array(0);
console.log(typedArrayByteOffset(float64Array));
console.log(typedArrayByteOffset(new Float64Array(0)));

const bigInt64Array = new BigInt64Array(0);
console.log(typedArrayByteOffset(bigInt64Array));
console.log(typedArrayByteOffset(new BigInt64Array(0)));

const bigUint64Array = new BigUint64Array(0);
console.log(typedArrayByteOffset(bigUint64Array));
console.log(typedArrayByteOffset(new BigUint64Array(0)));
