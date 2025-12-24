import qs from 'qs';

const obj = {foo: 'bar'};
const query = 'foo=bar';

// indices: false
qs.stringify(obj, {indices: false});

// defaults
qs.stringify(obj);

// arrayFormat: repeat
qs.stringify(obj, {arrayFormat: 'repeat'});

// arrayFormat: indices
qs.stringify(obj, {arrayFormat: 'indices'});

// arrayFormat: brackets
qs.stringify(obj, {arrayFormat: 'brackets'});

// arrayFormat: nonsense defaults to bracket
qs.stringify(obj, {arrayFormat: 'absolute gibberish'});

// encode: false
qs.stringify(obj, {encode: false});

// indices: false
qs.parse(query, { indices: false });

// indices: true
qs.parse(query, { indices: true });

// defaults
qs.parse(query);

// delimiter
qs.parse('a=foo;b=bar', {delimiter: ';'});

// allowDots: true
qs.parse('a.b=c', {allowDots: true});

// allowDots: false
qs.parse('a.b=c', {allowDots: false});

// parseArrays: false
qs.parse('a[]=1&a[]=2', {parseArrays: false});

// parseArrays: true
qs.parse('a[]=1&a[]=2', {parseArrays: true});
