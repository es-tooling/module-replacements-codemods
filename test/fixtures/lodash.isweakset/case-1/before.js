import isWeakSet from 'lodash.isweakset';

const a = isWeakSet(new WeakSet());
const b = !isWeakSet(new Set());
