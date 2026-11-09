

const a = (typeof fn === 'function' && Object.prototype.toString.call(fn) === '[object GeneratorFunction]');
const b = !(typeof other === 'function' && Object.prototype.toString.call(other) === '[object GeneratorFunction]');
