Object.is(undefined, -0);
Object.is(-0, -0);
Object.is(undefined, -0);
Object.is(null, -0);
Object.is(false, -0);
Object.is(true, -0);
Object.is(0, -0);
Object.is(42, -0);
Object.is(Infinity, -0);
Object.is(-Infinity, -0);
Object.is(NaN, -0);
Object.is('foo', -0);
Object.is(function () {}, -0);
Object.is([], -0);
Object.is({}, -0);

k = Object.is(null, -0);

let a = Object.is(x, -0) + y;
let b = x * Object.is(y, -0);
let c = Object.is(x, -0) === true;

[0, 1,2].map((v) => Object.is(v, -0));