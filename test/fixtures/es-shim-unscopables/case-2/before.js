const shimUnscopables = require('es-shim-unscopables');

shimUnscopables('includes');
shimUnscopables('concat');
shimUnscopables('copyWithin');

console.log('Hello World');