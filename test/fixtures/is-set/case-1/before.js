import isSet from 'is-set';

const a = isSet(new Set());
const b = !isSet(new Map());
