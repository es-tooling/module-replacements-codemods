import isWhitespace from './is-whitespace/index.js';

import isArrayBuffer from './is-array-buffer/index.js';

import isBooleanObject from './is-boolean-object/index.js';

import isDateObject from './is-date-object/index.js';

import isNumberObject from './is-number-object/index.js';

import isOdd from './is-odd/index.js';

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

import promiseAllsettled from './promise.allsettled/index.js';

import promiseAny from './promise.any/index.js';

import promisePrototypeFinally from './promise.prototype.finally/index.js';

import forEach from './for-each/index.js';

import arrayPrototypeAt from './array.prototype.at/index.js';

import arrayPrototypeConcat from './array.prototype.concat/index.js';

import arrayPrototypeEntries from './array.prototype.entries/index.js';

import arrayPrototypeFind from './array.prototype.find/index.js';

import arrayPrototypeFindIndex from './array.prototype.findIndex/index.js';

import arrayPrototypeFlat from './array.prototype.flat/index.js';

import arrayPrototypeFlatMap from './array.prototype.flatMap/index.js';

import arrayPrototypeForEach from './array.prototype.forEach/index.js';

import isBuiltinModule from './is-builtin-module/index.js';

import arrayFrom from './array.from/index.js';

import isEven from './is-even/index.js';

import isWindows from './is-windows/index.js';

import isTravis from './is-travis/index.js';

import isNumber from './is-number/index.js';

import has from './has/index.js';

import hasown from './hasown/index.js';

import hasOwnProp from './has-own-prop/index.js';

import objectAssign from './object-assign/index.js';

import objectEntries from './object.entries/index.js';

import objectIs from './object-is/index.js';

import isNan from './is-nan/index.js';

import numberIsnan from './number.isnan/index.js';

import objectFromentries from './object.fromentries/index.js';

import objectValues from './object.values/index.js';

import stringPrototypeMatchall from './string.prototype.matchall/index.js';

import stringPrototypeRepeat from './string.prototype.repeat/index.js';

import arrayPrototypeFindlast from './array.prototype.findlast/index.js';

import arrayPrototypeTosorted from './array.prototype.tosorted/index.js';

import filterArray from './filter-array/index.js';

import arrayPrototypeFindlastindex from './array.prototype.findlastindex/index.js';

import arrayPrototypeToreversed from './array.prototype.toreversed/index.js';

import arrayPrototypeReduce from './array.prototype.reduce/index.js';

import arrayPrototypePush from './array.prototype.push/index.js';

import arrayPrototypeJoin from './array.prototype.join/index.js';

import arrayPrototypeIndexof from './array.prototype.indexof/index.js';

import arrayPrototypeValues from './array.prototype.values/index.js';

import arrayPrototypeKeys from './array.prototype.keys/index.js';

import arrayPrototypeTospliced from './array.prototype.tospliced/index.js';

import arrayPrototypeWith from './array.prototype.with/index.js';

import arrayEvery from './array-every/index.js';

import arrayOf from './array.of/index.js';

import arrayMap from './array-map/index.js';

import indexOf from './index-of/index.js';

import lastIndexOf from './last-index-of/index.js';

import errorCause from './error-cause/index.js';

import leftPad from './left-pad/index.js';

import padLeft from './pad-left/index.js';

import md5 from './md5/index.js';

import arrayBufferByteLength from './array-buffer-byte-length/index.js';

import functionBind from './function-bind/index.js';

import arrayBufferPrototypeSlice from './arraybuffer.prototype.slice/index.js';

import stringPrototypeAt from './string.prototype.at/index.js';

import stringPrototypeLastindexof from './string.prototype.lastindexof/index.js';

import stringPrototypePadend from './string.prototype.padend/index.js';

import stringPrototypePadleft from './string.prototype.padleft/index.js';

import stringPrototypePadright from './string.prototype.padright/index.js';

import stringPrototypePadstart from './string.prototype.padstart/index.js';

import stringPrototypeReplaceall from './string.prototype.replaceall/index.js';

import stringPrototypeSplit from './string.prototype.split/index.js';

import stringPrototypeTrim from './string.prototype.trim/index.js';

import stringPrototypeTrimend from './string.prototype.trimend/index.js';

import stringPrototypeTrimstart from './string.prototype.trimstart/index.js';

import stringPrototypeTrimleft from './string.prototype.trimleft/index.js';

import stringPrototypeTrimright from './string.prototype.trimright/index.js';

import stringRaw from './string.raw/index.js';

import isPrimitive from './is-primitive/index.js';

export const codemods = {
	'is-whitespace': isWhitespace,
	'is-array-buffer': isArrayBuffer,
	'is-boolean-object': isBooleanObject,
	'is-date-object': isDateObject,
	'is-number-object': isNumberObject,
	'is-odd': isOdd,
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
	'promise.allsettled': promiseAllsettled,
	'promise.any': promiseAny,
	'promise.prototype.finally': promisePrototypeFinally,
	'for-each': forEach,
	'array.prototype.at': arrayPrototypeAt,
	'array.prototype.concat': arrayPrototypeConcat,
	'array.prototype.entries': arrayPrototypeEntries,
	'array.prototype.find': arrayPrototypeFind,
	'array.prototype.findIndex': arrayPrototypeFindIndex,
	'array.prototype.flat': arrayPrototypeFlat,
	'array.prototype.flatMap': arrayPrototypeFlatMap,
	'array.prototype.forEach': arrayPrototypeForEach,
	'is-builtin-module': isBuiltinModule,
	'array.from': arrayFrom,
	'is-even': isEven,
	'is-windows': isWindows,
	'is-travis': isTravis,
	'is-number': isNumber,
	has: has,
	hasown: hasown,
	'has-own-prop': hasOwnProp,
	'object-assign': objectAssign,
	'object.entries': objectEntries,
	'object-is': objectIs,
	'is-nan': isNan,
	'number.isnan': numberIsnan,
	'object.fromentries': objectFromentries,
	'object.values': objectValues,
	'string.prototype.matchall': stringPrototypeMatchall,
	'string.prototype.repeat': stringPrototypeRepeat,
	'array.prototype.findlast': arrayPrototypeFindlast,
	'array.prototype.tosorted': arrayPrototypeTosorted,
	'filter-array': filterArray,
	'array.prototype.findlastindex': arrayPrototypeFindlastindex,
	'array.prototype.toreversed': arrayPrototypeToreversed,
	'array.prototype.reduce': arrayPrototypeReduce,
	'array.prototype.push': arrayPrototypePush,
	'array.prototype.join': arrayPrototypeJoin,
	'array.prototype.indexof': arrayPrototypeIndexof,
	'array.prototype.values': arrayPrototypeValues,
	'array.prototype.keys': arrayPrototypeKeys,
	'array.prototype.tospliced': arrayPrototypeTospliced,
	'array.prototype.with': arrayPrototypeWith,
	'array-every': arrayEvery,
	'array.of': arrayOf,
	'array-map': arrayMap,
	'index-of': indexOf,
	'last-index-of': lastIndexOf,
	'error-cause': errorCause,
	'left-pad': leftPad,
	'pad-left': padLeft,
	md5: md5,
	'array-buffer-byte-length': arrayBufferByteLength,
	'function-bind': functionBind,
	'arraybuffer.prototype.slice': arrayBufferPrototypeSlice,
	'string.prototype.at': stringPrototypeAt,
	'string.prototype.lastindexof': stringPrototypeLastindexof,
	'string.prototype.padend': stringPrototypePadend,
	'string.prototype.padleft': stringPrototypePadleft,
	'string.prototype.padright': stringPrototypePadright,
	'string.prototype.padstart': stringPrototypePadstart,
	'string.prototype.replaceall': stringPrototypeReplaceall,
	'string.prototype.split': stringPrototypeSplit,
	'string.prototype.trim': stringPrototypeTrim,
	'string.prototype.trimend': stringPrototypeTrimend,
	'string.prototype.trimstart': stringPrototypeTrimstart,
	'string.prototype.trimleft': stringPrototypeTrimleft,
	'string.prototype.trimright': stringPrototypeTrimright,
	'string.raw': stringRaw,
	'is-primitive': isPrimitive,
};
