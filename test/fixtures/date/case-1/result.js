var assert = require('assert');

assert.deepEqual(Date, [
  'Date',
  'Date.prototype.getFullYear',
  'Date.prototype.getMonth',
  'Date.prototype.getDate',
  'Date.prototype.getUTCDate',
  'Date.prototype.getUTCFullYear',
  'Date.prototype.getUTCMonth',
  'Date.prototype.toUTCString',
  'Date.prototype.toDateString',
  'Date.prototype.toString',
  'Date.prototype.toISOString',
  'Date.prototype.toJSON',
  'Date.now',
  'Date.parse',
]);

assert.ok(new Date() instanceof Date);
assert.equal(typeof Date.now(), 'number');
