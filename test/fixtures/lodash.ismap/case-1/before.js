import isMap from 'lodash.ismap';

const a = isMap(new Map());
const b = !isMap(new Set());
