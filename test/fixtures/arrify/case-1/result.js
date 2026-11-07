

const val = 'foo';
const result = (val == null ? [] : Array.isArray(val) ? val : [val]);
