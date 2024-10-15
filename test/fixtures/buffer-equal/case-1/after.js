const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('abc');

const arr = Buffer.from([253, 254, 255]).equals(Buffer.from([253, 254, 255]));
const str = buf1.equals(Buffer.from('def'));