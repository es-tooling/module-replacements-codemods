import isMap from 'is-map';

const a = isMap(new Map());
const b = !isMap(new Set());
