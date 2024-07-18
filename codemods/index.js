import isWhitespace from './is-whitespace/index.js';

import isArrayBuffer from './is-array-buffer/index.js';

import isBooleanObject from './is-boolean-object/index.js';

import isDateObject from './is-date-object/index.js';

import isNumberObject from './is-number-object/index.js';

import isString from './is-string/index.js';

import isRegexp from './is-regexp/index.js';

import arrayPrototypeMap from './array.prototype.map/index.js';

import arrayPrototypeFilter from './array.prototype.filter/index.js';

import arrayIncludes from './array-includes/index.js';

import objectKeys from './object-keys/index.js';

import arrayPrototypeUnshift from './array.prototype.unshift/index.js';

export const codemods = {
    'is-whitespace': isWhitespace,
    'is-array-buffer': isArrayBuffer,
    'is-boolean-object': isBooleanObject,
    'is-date-object': isDateObject,
    'is-number-object': isNumberObject,
    'is-string': isString,
    'is-regexp': isRegexp,
    'array.prototype.map': arrayPrototypeMap,
    'array.prototype.filter': arrayPrototypeFilter,
    'array-includes': arrayIncludes,
    'object-keys': objectKeys,
    'array.prototype.unshift': arrayPrototypeUnshift
};
