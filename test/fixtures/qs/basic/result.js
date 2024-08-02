import pq from 'picoquery';

const obj = {foo: 'bar'};
const query = 'foo=bar';

// encode: false, indices: false
pq.stringify(obj, {"nesting":true,"nestingSyntax":"dot","arrayRepeat":true,"arrayRepeatSyntax":"repeat"});

// defaults
pq.stringify(obj, {"nesting":true,"nestingSyntax":"js","arrayRepeat":true,"arrayRepeatSyntax":"bracket"});

// arrayFormat: repeat
pq.stringify(obj, {"nesting":true,"nestingSyntax":"js","arrayRepeat":true,"arrayRepeatSyntax":"repeat"});

// arrayFormat: indices
pq.stringify(obj, {"nesting":true,"nestingSyntax":"js","arrayRepeat":false,"arrayRepeatSyntax":"bracket"});

// arrayFormat: brackets
pq.stringify(obj, {"nesting":true,"nestingSyntax":"js","arrayRepeat":true,"arrayRepeatSyntax":"bracket"});

// encode: false, indices: false
pq.parse(query, {"nesting":true,"nestingSyntax":"dot","arrayRepeat":true,"arrayRepeatSyntax":"repeat"});

// defaults
pq.parse(query, {"nesting":true,"nestingSyntax":"js","arrayRepeat":true,"arrayRepeatSyntax":"bracket"});

// delimiter
pq.parse('a=foo;b=bar', {"nesting":true,"nestingSyntax":"js","arrayRepeat":true,"arrayRepeatSyntax":"bracket","delimiter":";"});

// allowDots
pq.parse('a.b=c', {"nesting":true,"nestingSyntax":"dot","arrayRepeat":true,"arrayRepeatSyntax":"bracket"});

// parseArrays: false
pq.parse('a[]=1&a[]=2', {"nesting":true,"nestingSyntax":"js","arrayRepeat":false,"arrayRepeatSyntax":"bracket"});
