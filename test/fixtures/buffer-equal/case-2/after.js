const { Buffer } = require('node:buffer');


const buf1 = Buffer.from('abc');
const buffs = [Buffer.from([253, 254, 255]), Buffer.from([253, 254, 255])]

const arr = bufferEqual(...buffs);
const str = buf1.equals(Buffer.from('def'));