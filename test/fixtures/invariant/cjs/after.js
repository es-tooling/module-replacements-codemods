const invariant = require('tiny-invariant');

const a = 10;

invariant(a === 10, "a is 10");

invariant(a === 20, "a is 20");
