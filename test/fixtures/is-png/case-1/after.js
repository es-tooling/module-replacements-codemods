function isPng(buf) {
  if (!buf || buf.length < 8) return false;
  return buf[0] === 0x89 && buf[1] === 0x50
    && buf[2] === 0x4e && buf[3] === 0x47
    && buf[4] === 0x0d && buf[5] === 0x0a
    && buf[6] === 0x1a && buf[7] === 0x0a;
}

const buf = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
console.log(isPng(buf));
