import noop from 'lodash.noop';

noop();
noop.call(this);
const stop = condition ? noop : null;
const fallback = callback || noop;
const isFn = typeof noop === 'function';
