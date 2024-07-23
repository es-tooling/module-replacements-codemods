var banana = require('is-negative-zero');

banana(undefined);
banana(-0);
banana(undefined);
banana(null);
banana(false);
banana(true);
banana(0);
banana(42);
banana(Infinity);
banana(-Infinity);
banana(NaN);
banana('foo');
banana(function () {});
banana([]);
banana({});

k = Object.is(null, -0) || banana(null);

let a = banana(x) + y;
let b = x * banana(y);
let c = banana(x) === true;

[0, 1,2].map((v) => banana(v));