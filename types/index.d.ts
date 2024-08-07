/**
 * @typedef {import('./types.js').Codemod} Codemod
 * @typedef {import('./types.js').CodemodOptions} CodemodOptions
 */
/**
 * @type {Record<string, (options: CodemodOptions) => Codemod>}
 */
export const codemods: Record<string, (options: CodemodOptions) => Codemod>;
export type Codemod = import("./types.js").Codemod;
export type CodemodOptions = import("./types.js").CodemodOptions;
