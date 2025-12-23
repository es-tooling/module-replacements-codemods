import abortController from './codemods/abort-controller/index.js';
import arrayBufferByteLength from './codemods/array-buffer-byte-length/index.js';
import arrayEvery from './codemods/array-every/index.js';
import arrayIncludes from './codemods/array-includes/index.js';
import arrayMap from './codemods/array-map/index.js';
import arrayFrom from './codemods/array.from/index.js';
import arrayOf from './codemods/array.of/index.js';
import arrayPrototypeAt from './codemods/array.prototype.at/index.js';
import arrayPrototypeConcat from './codemods/array.prototype.concat/index.js';
import arrayPrototypeCopywithin from './codemods/array.prototype.copywithin/index.js';
import arrayPrototypeEntries from './codemods/array.prototype.entries/index.js';
import arrayPrototypeEvery from './codemods/array.prototype.every/index.js';
import arrayPrototypeFilter from './codemods/array.prototype.filter/index.js';
import arrayPrototypeFind from './codemods/array.prototype.find/index.js';
import arrayPrototypeFindindex from './codemods/array.prototype.findindex/index.js';
import arrayPrototypeFindlast from './codemods/array.prototype.findlast/index.js';
import arrayPrototypeFindlastindex from './codemods/array.prototype.findlastindex/index.js';
import arrayPrototypeFlat from './codemods/array.prototype.flat/index.js';
import arrayPrototypeFlatmap from './codemods/array.prototype.flatmap/index.js';
import arrayPrototypeForeach from './codemods/array.prototype.foreach/index.js';
import arrayPrototypeIndexof from './codemods/array.prototype.indexof/index.js';
import arrayPrototypeJoin from './codemods/array.prototype.join/index.js';
import arrayPrototypeKeys from './codemods/array.prototype.keys/index.js';
import arrayPrototypeLastindexof from './codemods/array.prototype.lastindexof/index.js';
import arrayPrototypeMap from './codemods/array.prototype.map/index.js';
import arrayPrototypePush from './codemods/array.prototype.push/index.js';
import arrayPrototypeReduce from './codemods/array.prototype.reduce/index.js';
import arrayPrototypeReduceright from './codemods/array.prototype.reduceright/index.js';
import arrayPrototypeSlice from './codemods/array.prototype.slice/index.js';
import arrayPrototypeSome from './codemods/array.prototype.some/index.js';
import arrayPrototypeSplice from './codemods/array.prototype.splice/index.js';
import arrayPrototypeToreversed from './codemods/array.prototype.toreversed/index.js';
import arrayPrototypeTosorted from './codemods/array.prototype.tosorted/index.js';
import arrayPrototypeTospliced from './codemods/array.prototype.tospliced/index.js';
import arrayPrototypeUnshift from './codemods/array.prototype.unshift/index.js';
import arrayPrototypeValues from './codemods/array.prototype.values/index.js';
import arrayPrototypeWith from './codemods/array.prototype.with/index.js';
import arraybufferPrototypeSlice from './codemods/arraybuffer.prototype.slice/index.js';
import bufferEquals from './codemods/buffer-equals/index.js';
import chalk from './codemods/chalk/index.js';
import cloneRegexp from './codemods/clone-regexp/index.js';
import concatMap from './codemods/concat-map/index.js';
import dataViewBuffer from './codemods/data-view-buffer/index.js';
import dataViewByteLength from './codemods/data-view-byte-length/index.js';
import dataViewByteOffset from './codemods/data-view-byte-offset/index.js';
import date from './codemods/date/index.js';
import deepEqual from './codemods/deep-equal/index.js';
import defineProperties from './codemods/define-properties/index.js';
import errorCause from './codemods/error-cause/index.js';
import esAggregateError from './codemods/es-aggregate-error/index.js';
import esDefineProperty from './codemods/es-define-property/index.js';
import esErrors from './codemods/es-errors/index.js';
import esGetIterator from './codemods/es-get-iterator/index.js';
import esSetTostringtag from './codemods/es-set-tostringtag/index.js';
import esShimUnscopables from './codemods/es-shim-unscopables/index.js';
import esStringHtmlMethods from './codemods/es-string-html-methods/index.js';
import filterArray from './codemods/filter-array/index.js';
import forEach from './codemods/for-each/index.js';
import functionBind from './codemods/function-bind/index.js';
import functionPrototypeName from './codemods/function.prototype.name/index.js';
import functionsHaveNames from './codemods/functions-have-names/index.js';
import getSymbolDescription from './codemods/get-symbol-description/index.js';
import global from './codemods/global/index.js';
import gopd from './codemods/gopd/index.js';
import has from './codemods/has/index.js';
import hasOwnProp from './codemods/has-own-prop/index.js';
import hasProto from './codemods/has-proto/index.js';
import hasSymbols from './codemods/has-symbols/index.js';
import hasTostringtag from './codemods/has-tostringtag/index.js';
import hasown from './codemods/hasown/index.js';
import indexOf from './codemods/index-of/index.js';
import isArrayBuffer from './codemods/is-array-buffer/index.js';
import isBooleanObject from './codemods/is-boolean-object/index.js';
import isBuiltinModule from './codemods/is-builtin-module/index.js';
import isDateObject from './codemods/is-date-object/index.js';
import isEven from './codemods/is-even/index.js';
import isNan from './codemods/is-nan/index.js';
import isNegativeZero from './codemods/is-negative-zero/index.js';
import isNpm from './codemods/is-npm/index.js';
import isNumber from './codemods/is-number/index.js';
import isNumberObject from './codemods/is-number-object/index.js';
import isOdd from './codemods/is-odd/index.js';
import isPlainObject from './codemods/is-plain-object/index.js';
import isPrimitive from './codemods/is-primitive/index.js';
import isRegexp from './codemods/is-regexp/index.js';
import isString from './codemods/is-string/index.js';
import isTravis from './codemods/is-travis/index.js';
import isWhitespace from './codemods/is-whitespace/index.js';
import isWindows from './codemods/is-windows/index.js';
import iterateValue from './codemods/iterate-value/index.js';
import lastIndexOf from './codemods/last-index-of/index.js';
import leftPad from './codemods/left-pad/index.js';
import mathAcosh from './codemods/math.acosh/index.js';
import mathAtanh from './codemods/math.atanh/index.js';
import mathCbrt from './codemods/math.cbrt/index.js';
import mathClz32 from './codemods/math.clz32/index.js';
import mathF16round from './codemods/math.f16round/index.js';
import mathFround from './codemods/math.fround/index.js';
import mathImul from './codemods/math.imul/index.js';
import mathLog10 from './codemods/math.log10/index.js';
import mathLog1p from './codemods/math.log1p/index.js';
import mathSign from './codemods/math.sign/index.js';
import md5 from './codemods/md5/index.js';
import numberIsfinite from './codemods/number.isfinite/index.js';
import numberIsinteger from './codemods/number.isinteger/index.js';
import numberIsnan from './codemods/number.isnan/index.js';
import numberIssafeinteger from './codemods/number.issafeinteger/index.js';
import numberParsefloat from './codemods/number.parsefloat/index.js';
import numberParseint from './codemods/number.parseint/index.js';
import numberPrototypeToexponential from './codemods/number.prototype.toexponential/index.js';
import objectAssign from './codemods/object-assign/index.js';
import objectIs from './codemods/object-is/index.js';
import objectKeys from './codemods/object-keys/index.js';
import objectAssign2 from './codemods/object.assign/index.js';
import objectDefineproperties from './codemods/object.defineproperties/index.js';
import objectEntries from './codemods/object.entries/index.js';
import objectFromentries from './codemods/object.fromentries/index.js';
import objectGetprototypeof from './codemods/object.getprototypeof/index.js';
import objectHasown from './codemods/object.hasown/index.js';
import objectKeys2 from './codemods/object.keys/index.js';
import objectValues from './codemods/object.values/index.js';
import padLeft from './codemods/pad-left/index.js';
import parseint from './codemods/parseint/index.js';
import promiseAllsettled from './codemods/promise.allsettled/index.js';
import promiseAny from './codemods/promise.any/index.js';
import promisePrototypeFinally from './codemods/promise.prototype.finally/index.js';
import qs from './codemods/qs/index.js';
import reflectGetprototypeof from './codemods/reflect.getprototypeof/index.js';
import reflectOwnkeys from './codemods/reflect.ownkeys/index.js';
import regexpPrototypeFlags from './codemods/regexp.prototype.flags/index.js';
import rimraf from './codemods/rimraf/index.js';
import setprototypeof from './codemods/setprototypeof/index.js';
import splitLines from './codemods/split-lines/index.js';
import stringPrototypeAt from './codemods/string.prototype.at/index.js';
import stringPrototypeLastindexof from './codemods/string.prototype.lastindexof/index.js';
import stringPrototypeMatchall from './codemods/string.prototype.matchall/index.js';
import stringPrototypePadend from './codemods/string.prototype.padend/index.js';
import stringPrototypePadleft from './codemods/string.prototype.padleft/index.js';
import stringPrototypePadright from './codemods/string.prototype.padright/index.js';
import stringPrototypePadstart from './codemods/string.prototype.padstart/index.js';
import stringPrototypeRepeat from './codemods/string.prototype.repeat/index.js';
import stringPrototypeReplaceall from './codemods/string.prototype.replaceall/index.js';
import stringPrototypeSplit from './codemods/string.prototype.split/index.js';
import stringPrototypeSubstr from './codemods/string.prototype.substr/index.js';
import stringPrototypeTrim from './codemods/string.prototype.trim/index.js';
import stringPrototypeTrimend from './codemods/string.prototype.trimend/index.js';
import stringPrototypeTrimleft from './codemods/string.prototype.trimleft/index.js';
import stringPrototypeTrimright from './codemods/string.prototype.trimright/index.js';
import stringPrototypeTrimstart from './codemods/string.prototype.trimstart/index.js';
import stringRaw from './codemods/string.raw/index.js';
import stripAnsi from './codemods/strip-ansi/index.js';
import symbolPrototypeDescription from './codemods/symbol.prototype.description/index.js';
import traverse from './codemods/traverse/index.js';
import typedArrayBuffer from './codemods/typed-array-buffer/index.js';
import typedArrayByteLength from './codemods/typed-array-byte-length/index.js';
import typedArrayByteOffset from './codemods/typed-array-byte-offset/index.js';
import typedArrayLength from './codemods/typed-array-length/index.js';
import typedarrayPrototypeSlice from './codemods/typedarray.prototype.slice/index.js';
import xtend from './codemods/xtend/index.js';


/**
 * @typedef {import('./types.js').Codemod} Codemod
 * @typedef {import('./types.js').CodemodOptions} CodemodOptions
 */

/**
 * @type {Record<string, (options: CodemodOptions) => Codemod>}
 */
export const codemods = {
  "abort-controller": abortController,
  "array-buffer-byte-length": arrayBufferByteLength,
  "array-every": arrayEvery,
  "array-includes": arrayIncludes,
  "array-map": arrayMap,
  "array.from": arrayFrom,
  "array.of": arrayOf,
  "array.prototype.at": arrayPrototypeAt,
  "array.prototype.concat": arrayPrototypeConcat,
  "array.prototype.copywithin": arrayPrototypeCopywithin,
  "array.prototype.entries": arrayPrototypeEntries,
  "array.prototype.every": arrayPrototypeEvery,
  "array.prototype.filter": arrayPrototypeFilter,
  "array.prototype.find": arrayPrototypeFind,
  "array.prototype.findindex": arrayPrototypeFindindex,
  "array.prototype.findlast": arrayPrototypeFindlast,
  "array.prototype.findlastindex": arrayPrototypeFindlastindex,
  "array.prototype.flat": arrayPrototypeFlat,
  "array.prototype.flatmap": arrayPrototypeFlatmap,
  "array.prototype.foreach": arrayPrototypeForeach,
  "array.prototype.indexof": arrayPrototypeIndexof,
  "array.prototype.join": arrayPrototypeJoin,
  "array.prototype.keys": arrayPrototypeKeys,
  "array.prototype.lastindexof": arrayPrototypeLastindexof,
  "array.prototype.map": arrayPrototypeMap,
  "array.prototype.push": arrayPrototypePush,
  "array.prototype.reduce": arrayPrototypeReduce,
  "array.prototype.reduceright": arrayPrototypeReduceright,
  "array.prototype.slice": arrayPrototypeSlice,
  "array.prototype.some": arrayPrototypeSome,
  "array.prototype.splice": arrayPrototypeSplice,
  "array.prototype.toreversed": arrayPrototypeToreversed,
  "array.prototype.tosorted": arrayPrototypeTosorted,
  "array.prototype.tospliced": arrayPrototypeTospliced,
  "array.prototype.unshift": arrayPrototypeUnshift,
  "array.prototype.values": arrayPrototypeValues,
  "array.prototype.with": arrayPrototypeWith,
  "arraybuffer.prototype.slice": arraybufferPrototypeSlice,
  "buffer-equals": bufferEquals,
  "chalk": chalk,
  "clone-regexp": cloneRegexp,
  "concat-map": concatMap,
  "data-view-buffer": dataViewBuffer,
  "data-view-byte-length": dataViewByteLength,
  "data-view-byte-offset": dataViewByteOffset,
  "date": date,
  "deep-equal": deepEqual,
  "define-properties": defineProperties,
  "error-cause": errorCause,
  "es-aggregate-error": esAggregateError,
  "es-define-property": esDefineProperty,
  "es-errors": esErrors,
  "es-get-iterator": esGetIterator,
  "es-set-tostringtag": esSetTostringtag,
  "es-shim-unscopables": esShimUnscopables,
  "es-string-html-methods": esStringHtmlMethods,
  "filter-array": filterArray,
  "for-each": forEach,
  "function-bind": functionBind,
  "function.prototype.name": functionPrototypeName,
  "functions-have-names": functionsHaveNames,
  "get-symbol-description": getSymbolDescription,
  "global": global,
  "gopd": gopd,
  "has": has,
  "has-own-prop": hasOwnProp,
  "has-proto": hasProto,
  "has-symbols": hasSymbols,
  "has-tostringtag": hasTostringtag,
  "hasown": hasown,
  "index-of": indexOf,
  "is-array-buffer": isArrayBuffer,
  "is-boolean-object": isBooleanObject,
  "is-builtin-module": isBuiltinModule,
  "is-date-object": isDateObject,
  "is-even": isEven,
  "is-nan": isNan,
  "is-negative-zero": isNegativeZero,
  "is-npm": isNpm,
  "is-number": isNumber,
  "is-number-object": isNumberObject,
  "is-odd": isOdd,
  "is-plain-object": isPlainObject,
  "is-primitive": isPrimitive,
  "is-regexp": isRegexp,
  "is-string": isString,
  "is-travis": isTravis,
  "is-whitespace": isWhitespace,
  "is-windows": isWindows,
  "iterate-value": iterateValue,
  "last-index-of": lastIndexOf,
  "left-pad": leftPad,
  "math.acosh": mathAcosh,
  "math.atanh": mathAtanh,
  "math.cbrt": mathCbrt,
  "math.clz32": mathClz32,
  "math.f16round": mathF16round,
  "math.fround": mathFround,
  "math.imul": mathImul,
  "math.log10": mathLog10,
  "math.log1p": mathLog1p,
  "math.sign": mathSign,
  "md5": md5,
  "number.isfinite": numberIsfinite,
  "number.isinteger": numberIsinteger,
  "number.isnan": numberIsnan,
  "number.issafeinteger": numberIssafeinteger,
  "number.parsefloat": numberParsefloat,
  "number.parseint": numberParseint,
  "number.prototype.toexponential": numberPrototypeToexponential,
  "object-assign": objectAssign,
  "object-is": objectIs,
  "object-keys": objectKeys,
  "object.assign": objectAssign2,
  "object.defineproperties": objectDefineproperties,
  "object.entries": objectEntries,
  "object.fromentries": objectFromentries,
  "object.getprototypeof": objectGetprototypeof,
  "object.hasown": objectHasown,
  "object.keys": objectKeys2,
  "object.values": objectValues,
  "pad-left": padLeft,
  "parseint": parseint,
  "promise.allsettled": promiseAllsettled,
  "promise.any": promiseAny,
  "promise.prototype.finally": promisePrototypeFinally,
  "qs": qs,
  "reflect.getprototypeof": reflectGetprototypeof,
  "reflect.ownkeys": reflectOwnkeys,
  "regexp.prototype.flags": regexpPrototypeFlags,
  "rimraf": rimraf,
  "setprototypeof": setprototypeof,
  "split-lines": splitLines,
  "string.prototype.at": stringPrototypeAt,
  "string.prototype.lastindexof": stringPrototypeLastindexof,
  "string.prototype.matchall": stringPrototypeMatchall,
  "string.prototype.padend": stringPrototypePadend,
  "string.prototype.padleft": stringPrototypePadleft,
  "string.prototype.padright": stringPrototypePadright,
  "string.prototype.padstart": stringPrototypePadstart,
  "string.prototype.repeat": stringPrototypeRepeat,
  "string.prototype.replaceall": stringPrototypeReplaceall,
  "string.prototype.split": stringPrototypeSplit,
  "string.prototype.substr": stringPrototypeSubstr,
  "string.prototype.trim": stringPrototypeTrim,
  "string.prototype.trimend": stringPrototypeTrimend,
  "string.prototype.trimleft": stringPrototypeTrimleft,
  "string.prototype.trimright": stringPrototypeTrimright,
  "string.prototype.trimstart": stringPrototypeTrimstart,
  "string.raw": stringRaw,
  "strip-ansi": stripAnsi,
  "symbol.prototype.description": symbolPrototypeDescription,
  "traverse": traverse,
  "typed-array-buffer": typedArrayBuffer,
  "typed-array-byte-length": typedArrayByteLength,
  "typed-array-byte-offset": typedArrayByteOffset,
  "typed-array-length": typedArrayLength,
  "typedarray.prototype.slice": typedarrayPrototypeSlice,
  "xtend": xtend,
};