/**
 * @typedef {import('../../types.js').Codemod} Codemod
 * @typedef {import('../../types.js').CodemodOptions} CodemodOptions
 */
/**
 * @NOTE
 * `array.prototype.at` supports passing a callback, e.g.:
 * `var results = at(arr, (x, i) => x);`
 *
 * We don't support that for now, but the most common usage seems to be similar
 * to the native usage
 *
 * @param {CodemodOptions} [options]
 * @returns {Codemod}
 */
export default function _default(options?: import("../../types.js").CodemodOptions | undefined): Codemod;
export type Codemod = import("../../types.js").Codemod;
export type CodemodOptions = import("../../types.js").CodemodOptions;
