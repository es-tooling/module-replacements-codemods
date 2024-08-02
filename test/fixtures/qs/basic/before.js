import qs from 'qs';

const obj = {foo: 'bar'};
const query = 'foo=bar';

// encode: false, indices: false
qs.stringify(obj, { encode: false, indices: false });

// defaults
qs.stringify(obj);

// arrayFormat: repeat
qs.stringify(obj, {arrayFormat: 'repeat'});

// arrayFormat: indices
qs.stringify(obj, {arrayFormat: 'indices'});

// arrayFormat: brackets
qs.stringify(obj, {arrayFormat: 'brackets'});

// encode: false, indices: false
qs.parse(query, { encode: false, indices: false });

// defaults
qs.parse(query);

// delimiter
qs.parse('a=foo;b=bar', {delimiter: ';'});

// allowDots
qs.parse('a.b=c', {allowDots: true});

// parseArrays: false
qs.parse('a[]=1&a[]=2', {parseArrays: false});
