const { Buffer } = require('node:buffer');
const bufferEqual = require('buffer-equals');

const buf1 = Buffer.from('abc');

const arr = bufferEqual(Buffer.from([253, 254, 255]), Buffer.from([253, 254, 255]));
const str = bufferEqual(buf1, Buffer.from('def'));
