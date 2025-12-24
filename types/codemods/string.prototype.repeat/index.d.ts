/**
 * @typedef {import('../../types.js').Codemod} Codemod
 * @typedef {import('../../types.js').CodemodOptions} CodemodOptions
 */
/**
 * @NOTE
 * `for-each` also supports passing objects to it, but this can't always be statically
 * analyzed. This codemod assumes usage of `for-each` on arrays only.
 *
 * If a project does use `for-each` on an object, you can replace it with `Object.entries(obj).forEach`
 *
 * @param {CodemodOptions} [options]
 * @returns {Codemod}
 */
export default function _default(options?: CodemodOptions): Codemod;
export type Codemod = import("../../types.js").Codemod;
export type CodemodOptions = import("../../types.js").CodemodOptions;
