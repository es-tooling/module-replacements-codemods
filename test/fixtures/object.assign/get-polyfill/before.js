const assign = require('object.assign').getPolyfill();

assign({}, {foo: 303}, {bar: 808});

assign({}, {});

const foo = {};
const bar = {};

assign(foo, bar);
