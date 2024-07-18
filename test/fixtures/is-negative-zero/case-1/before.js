var isNegativeZero = require('is-negative-zero');

isNegativeZero(undefined);
isNegativeZero(-0);
isNegativeZero(undefined);
isNegativeZero(null);
isNegativeZero(false);
isNegativeZero(true);
isNegativeZero(0);
isNegativeZero(42);
isNegativeZero(Infinity);
isNegativeZero(-Infinity);
isNegativeZero(NaN);
isNegativeZero('foo');
isNegativeZero(function () {});
isNegativeZero([]);
isNegativeZero({});

k = Object.is(null, -0) || isNegativeZero(null);

let a = isNegativeZero(x) + y;
let b = x * isNegativeZero(y);
let c = isNegativeZero(x) === true;

[0, 1,2].map((v) => isNegativeZero(v));