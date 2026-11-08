

const a = (Object.prototype.toString.call(arguments) === '[object Arguments]');
const b = !(Object.prototype.toString.call([]) === '[object Arguments]');
