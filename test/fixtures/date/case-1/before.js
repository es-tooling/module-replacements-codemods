var assert = require('assert');

var shims = require('date');

assert.deepEqual(shims, [
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

require('date/auto');

assert.ok(new Date() instanceof Date);
assert.equal(typeof Date.now(), 'number');
