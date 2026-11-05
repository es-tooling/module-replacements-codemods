import isJpg from 'is-jpg';

const buf = new Uint8Array([0xff, 0xd8, 0xff, 0xe0]);
console.log(isJpg(buf));
