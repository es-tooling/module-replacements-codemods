/**
 * @typedef {import('../../types.js').Codemod} Codemod
 * @typedef {import('../../types.js').CodemodOptions} CodemodOptions
 */
/**
 * @TODO
 * Remove the dep from package.json!
 * - can glob for all package.jsons, and remove it?
 */
/**
 * @param {CodemodOptions} [options]
 * @returns {Codemod}
 */
export default function _default(
	options?: import('../../types.js').CodemodOptions | undefined,
): Codemod;
export type Codemod = import('../../types.js').Codemod;
export type CodemodOptions = import('../../types.js').CodemodOptions;
