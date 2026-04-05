/**
 * @typedef {import('@ast-grep/napi').SgNode} SgNode
 * @typedef {import('@ast-grep/napi').Edit} Edit
 */

/**
 * Remove all import/require statements for a given module.
 *
 * Handles:
 * - `import X from 'pkg'`
 * - `import 'pkg'` (side-effect)
 * - `const/var X = require('pkg')`
 * - `require('pkg')` (side-effect expression statement)
 *
 * @param {SgNode} root - The root of the AST.
 * @param {string} moduleName - The module to remove.
 * @returns {{ edits: Edit[], localNames: string[] }}
 */
export function removeImport(root, moduleName) {
	/** @type {Edit[]} */
	const edits = [];
	/** @type {string[]} */
	const localNames = [];

	// ESM: import X from 'pkg' and import 'pkg' (side-effect)
	for (const imp of root.findAll({
		rule: {
			any: [
				{
					pattern: {
						context: `import $NAME from '${moduleName}'`,
						strictness: 'relaxed',
					},
				},
				{
					pattern: {
						context: `import '${moduleName}'`,
						strictness: 'relaxed',
					},
				},
			],
		},
	})) {
		const nameMatch = imp.getMatch('NAME');
		if (nameMatch) localNames.push(nameMatch.text());
		edits.push(imp.replace(''));
	}

	// CJS: const/var X = require('pkg')
	for (const imp of root.findAll({
		rule: {
			any: [
				{
					pattern: {
						context: `const $NAME = require('${moduleName}')`,
						strictness: 'relaxed',
					},
				},
				{
					pattern: {
						context: `var $NAME = require('${moduleName}')`,
						strictness: 'relaxed',
					},
				},
			],
		},
	})) {
		const nameMatch = imp.getMatch('NAME');
		if (nameMatch) localNames.push(nameMatch.text());
		edits.push(imp.replace(''));
	}

	// CJS side-effect: require('pkg') as a standalone expression statement
	for (const imp of root.findAll({
		rule: {
			pattern: {
				context: `require('${moduleName}')`,
				strictness: 'relaxed',
			},
			not: {
				inside: {
					kind: 'variable_declarator',
				},
			},
		},
	})) {
		edits.push(imp.replace(''));
	}

	return { edits, localNames };
}

/**
 * Find all named imports from a specific module in the AST.
 *
 * @param {SgNode} root - The root of the AST.
 * @param {string} moduleName - The name of the module to find imports from.
 * @returns {SgNode[]} - An array of matched import nodes.
 */
export function findNamedDefaultImport(root, moduleName) {
	const imports = root.findAll({
		rule: {
			any: [
				{
					pattern: {
						context: `import $NAME from '${moduleName}'`,
						strictness: 'relaxed',
					},
				},
				{
					pattern: {
						context: `const $NAME = require('${moduleName}')`,
						strictness: 'relaxed',
					},
				},
			],
		},
	});

	return imports;
}
