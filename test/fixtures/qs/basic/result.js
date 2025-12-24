import pq from 'picoquery';

const obj = {foo: 'bar'};
const query = 'foo=bar';

// indices: false
pq.stringify(obj, {"nesting":true,"nestingSyntax":"dot","arrayRepeat":true,"arrayRepeatSyntax":"repeat"});

// defaults
pq.stringify(obj, {"nesting":true,"nestingSyntax":"js","arrayRepeat":true,"arrayRepeatSyntax":"bracket"});

// arrayFormat: repeat
pq.stringify(obj, {"nesting":true,"nestingSyntax":"js","arrayRepeat":true,"arrayRepeatSyntax":"repeat"});

// arrayFormat: indices
pq.stringify(obj, {"nesting":true,"nestingSyntax":"js","arrayRepeat":false,"arrayRepeatSyntax":"bracket"});

// arrayFormat: brackets
pq.stringify(obj, {"nesting":true,"nestingSyntax":"js","arrayRepeat":true,"arrayRepeatSyntax":"bracket"});

// arrayFormat: nonsense defaults to bracket
pq.stringify(obj, {"nesting":true,"nestingSyntax":"js","arrayRepeat":true,"arrayRepeatSyntax":"bracket"});

// encode: false
decodeURIComponent(pq.stringify(obj, {"nesting":true,"nestingSyntax":"js","arrayRepeat":true,"arrayRepeatSyntax":"bracket"}));

// indices: false
pq.parse(query, {"nesting":true,"nestingSyntax":"dot","arrayRepeat":true,"arrayRepeatSyntax":"repeat"});

// indices: true
pq.parse(query, {"nesting":true,"nestingSyntax":"js","arrayRepeat":true,"arrayRepeatSyntax":"bracket"});

// defaults
pq.parse(query, {"nesting":true,"nestingSyntax":"js","arrayRepeat":true,"arrayRepeatSyntax":"bracket"});

// delimiter
pq.parse('a=foo;b=bar', {"nesting":true,"nestingSyntax":"js","arrayRepeat":true,"arrayRepeatSyntax":"bracket","delimiter":";"});

// allowDots: true
pq.parse('a.b=c', {"nesting":true,"nestingSyntax":"js","arrayRepeat":true,"arrayRepeatSyntax":"bracket"});

// allowDots: false
pq.parse('a.b=c', {"nesting":true,"nestingSyntax":"index","arrayRepeat":true,"arrayRepeatSyntax":"bracket"});

// parseArrays: false
pq.parse('a[]=1&a[]=2', {"nesting":true,"nestingSyntax":"js","arrayRepeat":false,"arrayRepeatSyntax":"bracket"});

// parseArrays: true
pq.parse('a[]=1&a[]=2', {"nesting":true,"nestingSyntax":"js","arrayRepeat":true,"arrayRepeatSyntax":"bracket"});
