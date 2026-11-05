function isJpg(buf) {
  if (!buf || buf.length < 3) return false;
  return buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
}

const buf = new Uint8Array([0xff, 0xd8, 0xff, 0xe0]);
console.log(isJpg(buf));
