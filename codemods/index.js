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

import arrayPrototypeSplice from './array.prototype.splice/index.js';

import arrayPrototypeSome from './array.prototype.some/index.js';

import isNegativeZero from './is-negative-zero/index.js';

import arrayPrototypeSlice from './array.prototype.slice/index.js';

import arrayPrototypeReduceright from './array.prototype.reduceright/index.js';

import arrayPrototypeEvery from './array.prototype.every/index.js';

import functionPrototypeName from './function.prototype.name/index.js';

import functionsHaveNames from './functions-have-names/index.js';

import gopd from './gopd/index.js';

import hasProto from './has-proto/index.js';

import hasSymbols from './has-symbols/index.js';

import hasTostringtag from './has-tostringtag/index.js';

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
	'array.prototype.unshift': arrayPrototypeUnshift,
	'array.prototype.splice': arrayPrototypeSplice,
	'array.prototype.some': arrayPrototypeSome,
	'is-negative-zero': isNegativeZero,
	'array.prototype.slice': arrayPrototypeSlice,
	'array.prototype.reduceright': arrayPrototypeReduceright,
	'array.prototype.every': arrayPrototypeEvery,
	'function.prototype.name': functionPrototypeName,
	'functions-have-names': functionsHaveNames,
	gopd: gopd,
	'has-proto': hasProto,
	'has-symbols': hasSymbols,
	'has-tostringtag': hasTostringtag,
};
