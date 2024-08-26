/**
 * @param {CodemodOptions} [options]
 * @returns {Codemod}
 */
export default function _default(options?: import("../../types.js").CodemodOptions | undefined): Codemod;
export type Codemod = import("../../types.js").Codemod;
export type CodemodOptions = import("../../types.js").CodemodOptions;
export type SgNode = import("@ast-grep/napi").SgNode;
export type ReplacementOptions = Record<string, unknown> | ((value: SgNode) => Record<string, unknown> | null) | null;
export type Replacement = ({
    kind: string;
    options: ReplacementOptions;
});
export type Replacer = ({
    replacements: Replacement[];
});
