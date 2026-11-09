import isSet from 'lodash.isset';

const a = isSet(new Set());
const b = !isSet(new Map());
