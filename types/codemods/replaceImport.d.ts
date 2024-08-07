/**
 * @typedef {Object} Module
 * @property {String} moduleName
 * @property {String} importName
 * @property {boolean?} cjsNamespace
 */
/**
 * Replaces an import statement from one module to another. Handles esm different
 * variations of esm and cjs imports, as well as code references to the imports.
 *
 * @param {import('jscodeshift')} j
 * @param {import('jscodeshift').Collection<any>} root
 * @param {Module} importModule
 * @param {Module} replacementModule
 */
export function replaceImport(
	j: import('jscodeshift/src/core.js').JSCodeshift,
	root: import('jscodeshift').Collection<any>,
	importModule: Module,
	replacementModule: Module,
): boolean;
export type Module = {
	moduleName: string;
	importName: string;
	cjsNamespace: boolean | null;
};
