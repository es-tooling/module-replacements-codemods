const { Buffer } = require('node:buffer');
const bufferEqual = require('buffer-equal');

const buf1 = Buffer.from('abc');
const buffs = [Buffer.from([253, 254, 255]), Buffer.from([253, 254, 255])]

const arr = bufferEqual(...buffs);
const str = bufferEqual(buf1, Buffer.from('def'));