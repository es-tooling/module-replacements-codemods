

const val = 'foo';
(val == null ? [] : Array.isArray(val) ? val : [val]);
