

const str = '\uFEFFfoo';
const result = str.charCodeAt(0) === 0xFEFF ? str.slice(1) : str;
