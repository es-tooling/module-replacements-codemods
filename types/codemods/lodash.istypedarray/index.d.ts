export type Codemod = import('../../types.js').Codemod;
export type CodemodOptions = import('../../types.js').CodemodOptions;
/**
 * @typedef {import('../../types.js').Codemod} Codemod
 * @typedef {import('../../types.js').CodemodOptions} CodemodOptions
 */
/**
 * @param {CodemodOptions} [options]
 * @returns {Codemod}
 */
export default function (options?: CodemodOptions): Codemod;
