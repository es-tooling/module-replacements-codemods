import isWhitespace from './is-whitespace/index.js';

import isArrayBuffer from './is-array-buffer/index.js';

import isBooleanObject from './is-boolean-object/index.js';

import isDateObject from './is-date-object/index.js';

import isNumberObject from './is-number-object/index.js';

import isString from './is-string/index.js';

import isRegexp from './is-regexp/index.js';

export const codemods = {
    'is-whitespace': isWhitespace,
    'is-array-buffer': isArrayBuffer,
    'is-boolean-object': isBooleanObject,
    'is-date-object': isDateObject,
    'is-number-object': isNumberObject,
    'is-string': isString,
    'is-regexp': isRegexp
};
