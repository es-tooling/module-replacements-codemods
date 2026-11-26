

(() => {})();
(() => {}).call(this);
const stop = condition ? (() => {}) : null;
const fallback = callback || (() => {});
const isFn = typeof (() => {}) === 'function';
