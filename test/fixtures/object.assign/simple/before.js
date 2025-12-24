import assign from 'object.assign';

assign({}, {foo: 303}, {bar: 808});

assign({}, {});

const foo = {};
const bar = {};

assign(foo, bar);
