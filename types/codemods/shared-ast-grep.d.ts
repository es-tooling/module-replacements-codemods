/**
 * @typedef {import('@ast-grep/napi').SgNode} SgNode
 */
/**
 * Find all named imports from a specific module in the AST.
 *
 * @param {SgNode} root - The root of the AST.
 * @param {string} moduleName - The name of the module to find imports from.
 * @returns {SgNode[]} - An array of matched import nodes.
 */
export function findNamedImports(root: SgNode, moduleName: string): SgNode[];
export type SgNode = import("@ast-grep/napi").SgNode;
