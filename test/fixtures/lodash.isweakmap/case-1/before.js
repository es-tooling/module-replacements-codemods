import isWeakMap from 'lodash.isweakmap';

const a = isWeakMap(new WeakMap());
const b = !isWeakMap(new Map());
