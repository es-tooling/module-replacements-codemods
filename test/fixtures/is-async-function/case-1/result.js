

const a = (typeof fn === 'function' && Object.prototype.toString.call(fn) === '[object AsyncFunction]');
const b = !(typeof other === 'function' && Object.prototype.toString.call(other) === '[object AsyncFunction]');
