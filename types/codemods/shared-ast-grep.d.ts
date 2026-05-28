/**
 * @typedef {import('@ast-grep/napi').SgNode} SgNode
 * @typedef {import('@ast-grep/napi').Edit} Edit
 */
/**
 * Find named ESM imports and destructured CJS requires for a module.
 *
 * Handles:
 * - `import { X } from 'pkg'` / `import { X as Y } from 'pkg'`
 * - `const/var/let { X } = require('pkg')`
 *
 * @param {SgNode} root - The root of the AST.
 * @param {string} moduleName - The module to find.
 * @returns {{ imports: SgNode[], localNames: string[], exportToLocal: Record<string, string> }}
 */
export function findNamedImports(root: SgNode, moduleName: string): {
    imports: SgNode[];
    localNames: string[];
    exportToLocal: Record<string, string>;
};
/**
 * Remove all import/require statements for a given module.
 *
 * Handles:
 * - `import X from 'pkg'`
 * - `import { X } from 'pkg'` / `import { X as Y } from 'pkg'`
 * - `import 'pkg'` (side-effect)
 * - `const/var X = require('pkg')`
 * - `const { X } = require('pkg')`
 * - `require('pkg')` (side-effect expression statement)
 *
 * @param {SgNode} root - The root of the AST.
 * @param {string} moduleName - The module to remove.
 * @returns {{ edits: Edit[], localNames: string[] }}
 */
export function removeImport(root: SgNode, moduleName: string): {
    edits: Edit[];
    localNames: string[];
};
/**
 * Find default imports of a module and resolve the local identifier name.
 *
 * @param {SgNode} root - The root of the AST.
 * @param {string} moduleName - The module to find imports for.
 * @returns {{ imports: SgNode[], identifierName: string | null }}
 */
export function findDefaultImportIdentifier(root: SgNode, moduleName: string): {
    imports: SgNode[];
    identifierName: string | null;
};
/**
 * Low-level helper that finds all calls to `fromIdentifier(...)` and applies
 * a custom format callback to produce the replacement text for each call.
 * Return `null` from the callback to skip a call without producing an edit.
 *
 * @param {SgNode} root - The root of the AST.
 * @param {string} fromIdentifier - The identifier currently being called.
 * @param {(args: string[]) => string | null} formatReplacement - Receives the argument texts and returns the replacement string, or null to skip.
 * @returns {Edit[]}
 */
export function computeCallReplacementEdits(root: SgNode, fromIdentifier: string, formatReplacement: (args: string[]) => string | null): Edit[];
/**
 * Compute edits that replace every call of `fromIdentifier(...)` with
 * `toCallee(...)`, preserving the original argument list verbatim.
 *
 * @param {SgNode} root - The root of the AST.
 * @param {string} fromIdentifier - The identifier currently being called.
 * @param {string} toCallee - The replacement callee expression (e.g. `Array.of`).
 * @returns {Edit[]}
 */
export function computeSimpleCallReplacementEdits(root: SgNode, fromIdentifier: string, toCallee: string): Edit[];
/**
 * Iterate over call expressions of a specific identifier and generate edits.
 *
 * @param {SgNode} root - The root of the AST.
 * @param {string} identifierName - The identifier being called.
 * @param {string} methodName - The native method name to replace with (e.g., 'concat').
 * @param {((args: SgNode[]) => boolean)} shouldTransform - Function that receives args and returns whether to transform.
 * @returns {Edit[]}
 */
export function computePolyfillMethodCallReplacementEdits(root: SgNode, identifierName: string, methodName: string, shouldTransform: ((args: SgNode[]) => boolean)): Edit[];
/**
 * Replace a default import/require of one package with another.
 * If toIdentifier is not provided, the original local name is preserved.
 *
 * @param {SgNode} root - The root of the AST.
 * @param {string} fromPackage - The package being replaced
 * @param {string} toPackage - The new package specifier
 * @param {string} [toIdentifier] - The local name to use in the replacement (defaults to original name)
 * @param {boolean} [asNamespace=false] - When true, uses `import * as NAME from` instead of `import NAME from`
 * @returns {{ edits: Edit[], localNames: string[], quoteType: string }}
 */
export function replaceDefaultImport(root: SgNode, fromPackage: string, toPackage: string, toIdentifier?: string, asNamespace?: boolean): {
    edits: Edit[];
    localNames: string[];
    quoteType: string;
};
/**
 * Remove the import of a polyfill module and replace all references to its
 * default import identifier with the given replacement string.
 *
 * Handles:
 * - `import X from 'pkg'`
 * - `const/var X = require('pkg')`
 *
 * @param {SgNode} root - The root of the AST.
 * @param {string} moduleName - The polyfill module to remove.
 * @param {string} replacement - The replacement text for identifier references.
 * @returns {{ edits: Edit[] }}
 */
export function replacePolyfillUsage(root: SgNode, moduleName: string, replacement: string): {
    edits: Edit[];
};
/**
 * Compute edits that replace every call of `identifierName(arg)` with
 * `arg.propertyName`, converting a polyfill function call to a native property access.
 *
 * @param {SgNode} root - The root of the AST.
 * @param {string} identifierName - The identifier currently being called.
 * @param {string} propertyName - The native property name to replace with (e.g., 'length').
 * @returns {Edit[]}
 */
export function computePolyfillPropertyReplacementEdits(root: SgNode, identifierName: string, propertyName: string): Edit[];
/**
 * Replace a default import/require of one package with a named import from another package.
 *
 * @param {SgNode} root - The root of the AST.
 * @param {string} fromPackage - The package being replaced
 * @param {string} toPackage - The new package specifier
 * @param {string} namedImport - The named import to use (e.g., 'stripVTControlCharacters')
 * @returns {{ edits: Edit[], localNames: string[], quoteType: string }}
 */
export function replaceDefaultWithNamedImport(root: SgNode, fromPackage: string, toPackage: string, namedImport: string): {
    edits: Edit[];
    localNames: string[];
    quoteType: string;
};
export type SgNode = import("@ast-grep/napi").SgNode;
export type Edit = import("@ast-grep/napi").Edit;
