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

	// CJS assignment: X = require('pkg') or obj.prop = require('pkg')
	for (const imp of root.findAll({
		rule: {
			any: [
				{
					pattern: {
						context: `$TARGET = require('${moduleName}')`,
						strictness: 'relaxed',
					},
				},
				{
					pattern: {
						context: `$TARGET = require('${moduleName}');`,
						strictness: 'relaxed',
					},
				},
			],
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

/**
 * Replace a default import/require of one package with another.
 *
 * @param {SgNode} root - The root of the AST.
 * @param {string} fromPackage - The package being replaced
 * @param {string} toPackage - The new package specifier
 * @param {string} toIdentifier - The local name to use in the replacement
 * @returns {{ edits: Edit[], localNames: string[], quoteType: string }}
 */
export function replaceDefaultImport(
	root,
	fromPackage,
	toPackage,
	toIdentifier,
) {
	const imports = root.findAll({
		rule: {
			any: [
				{
					pattern: {
						context: `import $NAME from '${fromPackage}'`,
						strictness: 'relaxed',
					},
				},
				{
					pattern: {
						context: `const $NAME = require('${fromPackage}')`,
						strictness: 'relaxed',
					},
				},
				{
					pattern: {
						context: `var $NAME = require('${fromPackage}')`,
						strictness: 'relaxed',
					},
				},
			],
		},
	});

	/** @type {Edit[]} */
	const edits = [];
	/** @type {string[]} */
	const localNames = [];
	let quoteType = "'";

	for (const imp of imports) {
		const nameMatch = imp.getMatch('NAME');
		if (!nameMatch) continue;

		localNames.push(nameMatch.text());

		const impText = imp.text();
		if (impText.includes('"')) quoteType = '"';

		const isCommonJS = imp.find('require($SOURCE)') !== null;

		if (isCommonJS) {
			edits.push(
				imp.replace(
					`const ${toIdentifier} = require(${quoteType}${toPackage}${quoteType});`,
				),
			);
		} else {
			edits.push(
				imp.replace(
					`import ${toIdentifier} from ${quoteType}${toPackage}${quoteType};`,
				),
			);
		}
	}

	return { edits, localNames, quoteType };
}
