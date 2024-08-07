/**
 * type definition for return type object
 * @typedef {Object} RemoveImport
 * @property {string} identifier - the name of the module as it was imported or required. for example, `keys` in `import keys from 'object-keys'`
 * @typedef {Object} ReplaceDefaultImport
 * @property {string} identifier - the name of the module as it was imported or required. for example, `keys` in `import keys from 'object-keys'`
 */
/**
 * @param {string} name - package name to remove import/require calls for
 * @param {import("jscodeshift").Collection} root - package name to remove import/require calls for
 * @param {import("jscodeshift").JSCodeshift} j - jscodeshift instance
 * @returns {RemoveImport}
 */
export function removeImport(
	name: string,
	root: import('jscodeshift').Collection,
	j: import('jscodeshift').JSCodeshift,
): RemoveImport;
/**
 * @param {string} code - code to insert after the last import
 * @param {import("jscodeshift").Collection} root - jscodeshift tree of the file containing the import
 * @param {import("jscodeshift").JSCodeshift} j - jscodeshift instance
 *
 */
export function insertAfterImports(
	code: string,
	root: import('jscodeshift').Collection,
	j: import('jscodeshift').JSCodeshift,
): void;
/**
 * Analyzes an `import` or `require` statement to detect which names are being
 * imported and what identifiers is the developer assigning them to. Returns a
 * map with the package exports as keys and developer-assigned names as values.
 *
 * The map may optionally contain the special symbol {@link DEFAULT_IMPORT} if
 * the package is imported like:
 *
 *   - import a from 'pkg'
 *   or
 *   - import a, { b } from 'pkg'
 *
 * The map may optionally contain the special symbol {@link NAMESPACE_IMPORT}
 * if the package is imported like:
 *
 *   - import * as a from 'pkg'
 *
 * @param {string} packageName - package name to retrieve its identifier map
 * @param {import("jscodeshift").Collection} root - jcodeshift tree of the file containing the import
 * @param {import("jscodeshift").JSCodeshift} j - jscodeshift instance
 */
export function getImportIdentifierMap(
	packageName: string,
	root: import('jscodeshift').Collection,
	j: import('jscodeshift').JSCodeshift,
): Record<string, string | undefined> & {
	[DEFAULT_IMPORT]?: string;
	[NAMESPACE_IMPORT]?: string;
};
/**
 * Replaces import declarations that use default specifiers
 * Finds and replaces:
 * - `import React from 'react';`
 * - `var React = require('react');`
 *
 * Todo: This function does not handle `Object.React = require('react)` yet
 *
 * @param {string} name - old package name to replace import/require calls for
 * @param {string} newSpecifier - new specifier name
 * @param {string} newName - new package name
 * @param {import("jscodeshift").Collection} root - package name to replace import/require calls for
 * @param {import("jscodeshift").JSCodeshift} j - jscodeshift instance
 * @returns {ReplaceDefaultImport}
 */
export function replaceDefaultImport(
	name: string,
	newSpecifier: string,
	newName: string,
	root: import('jscodeshift').Collection,
	j: import('jscodeshift').JSCodeshift,
): ReplaceDefaultImport;
/**
 * @param {string} method - e.g. `array.prototype.flatMap`
 * @param {string} identifierName - e.g. `flatMap`
 * @param {import("jscodeshift").Collection} root - package name to remove import/require calls for
 * @param {import("jscodeshift").JSCodeshift} j - jscodeshift instance
 * @returns {boolean} - true if the method was found and transformed, false otherwise
 */
export function transformArrayMethod(
	method: string,
	identifierName: string,
	root: import('jscodeshift').Collection,
	j: import('jscodeshift').JSCodeshift,
): boolean;
/**
 * @param {import("jscodeshift").ASTPath<import("jscodeshift").CallExpression>} path -  jscodeshift path
 * @param {string} instanceName - e.g. `Uint8Array`
 * @param {string} propertyName - e.g. `length`
 * @param {import("jscodeshift").JSCodeshift} j - jscodeshift instance
 * @returns
 */
export function transformInstanceProperty(
	path: import('jscodeshift').ASTPath<import('jscodeshift').CallExpression>,
	instanceName: string,
	propertyName: string,
	j: import('jscodeshift').JSCodeshift,
): boolean;
/**
 * @param {import("jscodeshift").ASTPath<import("jscodeshift").CallExpression>} path -  jscodeshift path
 * @param {string} instanceName - e.g. `Uint8Array`
 * @param {string} methodName - e.g. `slice`
 * @param {import("jscodeshift").JSCodeshift} j - jscodeshift instance
 * @returns
 */
export function transformInstanceMethod(
	path: import('jscodeshift').ASTPath<import('jscodeshift').CallExpression>,
	instanceName: string,
	methodName: string,
	j: import('jscodeshift').JSCodeshift,
): boolean;
/**
 * @param {string} method - e.g. `array.prototype.flatMap`
 * @param {string} identifierName - e.g. `flatMap`
 * @param {import("jscodeshift").Collection} root - package name to remove import/require calls for
 * @param {import("jscodeshift").JSCodeshift} j - jscodeshift instance
 * @returns {boolean} - true if the method was found and transformed, false otherwise
 */
export function transformStringMethod(
	method: string,
	identifierName: string,
	root: import('jscodeshift').Collection,
	j: import('jscodeshift').JSCodeshift,
): boolean;
/**
 * @param {string} importName - e.g. `math.acosh/polyfill`
 * @param {string} methodName - e.g. `acosh`
 * @param {import("jscodeshift").Collection} root - package name to remove import/require calls for
 * @param {import("jscodeshift").JSCodeshift} j - jscodeshift instance
 * @returns {boolean} - true if the method was found and transformed, false otherwise
 */
export function transformMathPolyfill(
	importName: string,
	methodName: string,
	root: import('jscodeshift').Collection,
	j: import('jscodeshift').JSCodeshift,
): boolean;
/**
 * @param {string} importName = e.g., `define-properties`
 * @param {string} identifier = e.g., `supportsDescriptors`
 * @param {import("jscodeshift").Collection} root
 * @param {import("jscodeshift").JSCodeshift} j - jscodeshift instance
 */
export function getVariableExpressionHasIdentifier(
	importName: string,
	identifier: string,
	root: import('jscodeshift').Collection,
	j: import('jscodeshift').JSCodeshift,
): boolean;
/**
 * @param {string} importName = e.g., `define-properties`
 * @param {string | boolean | null | number | RegExp} value = e.g., true or "string value"
 * @param {import("jscodeshift").Collection} root
 * @param {import("jscodeshift").JSCodeshift} j - jscodeshift instance
 */
export function replaceRequireMemberExpression(
	importName: string,
	value: string | boolean | null | number | RegExp,
	root: import('jscodeshift').Collection,
	j: import('jscodeshift').JSCodeshift,
): boolean;
/**
 *
 * @param {number} line
 * @param {import("jscodeshift").Collection} root
 * @param {import("jscodeshift").JSCodeshift} j
 */
export function getAncestorOnLine(
	line: number,
	root: import('jscodeshift').Collection,
	j: import('jscodeshift').JSCodeshift,
): any;
/**
 *
 * @param {import("jscodeshift").CommentBlock} comment
 * @param {number} startLine
 * @param {import("jscodeshift").Collection} root
 * @param {import("jscodeshift").JSCodeshift} j
 */
export function insertCommentAboveNode(
	comment: import('jscodeshift').CommentBlock,
	startLine: number,
	root: import('jscodeshift').Collection,
	j: import('jscodeshift').JSCodeshift,
): void;
export const DEFAULT_IMPORT: unique symbol;
export const NAMESPACE_IMPORT: unique symbol;
/**
 * type definition for return type object
 */
export type RemoveImport = {
	/**
	 * - the name of the module as it was imported or required. for example, `keys` in `import keys from 'object-keys'`
	 */
	identifier: string;
};
/**
 * type definition for return type object
 */
export type ReplaceDefaultImport = {
	/**
	 * - the name of the module as it was imported or required. for example, `keys` in `import keys from 'object-keys'`
	 */
	identifier: string;
};
