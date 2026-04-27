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
				{
					pattern: {
						context: `var $NAME = require('${moduleName}')`,
						strictness: 'relaxed',
					},
				},
			],
		},
	});

	return imports;
}

/**
 * Find default imports of a module and resolve the local identifier name.
 *
 * @param {SgNode} root - The root of the AST.
 * @param {string} moduleName - The module to find imports for.
 * @returns {{ imports: SgNode[], identifierName: string | null }}
 */
export function findDefaultImportIdentifier(root, moduleName) {
	const imports = findNamedDefaultImport(root, moduleName);
	let identifierName = null;
	for (const imp of imports) {
		const nameMatch = imp.getMatch('NAME');
		if (nameMatch) {
			identifierName = nameMatch.text();
			break;
		}
	}
	return { imports, identifierName };
}

/**
 * Compute edits that replace every call of `fromIdentifier(...)` with
 * `toCallee(...)`, preserving the original argument list verbatim.
 *
 * @param {SgNode} root - The root of the AST.
 * @param {string} fromIdentifier - The identifier currently being called.
 * @param {string} toCallee - The replacement callee expression (e.g. `Array.of`).
 * @returns {Edit[]}
 */
export function computeSimpleCallReplacementEdits(
	root,
	fromIdentifier,
	toCallee,
) {
	/** @type {Edit[]} */
	const edits = [];
	const calls = root.findAll({
		rule: {
			pattern: `${fromIdentifier}($$$ARGS)`,
		},
	});
	for (const call of calls) {
		const argsMatch = call.getMultipleMatches('ARGS');
		const argsText = argsMatch
			? argsMatch
					.filter((m) => m.kind() !== ',')
					.map((m) => m.text())
					.join(', ')
			: '';
		edits.push(call.replace(`${toCallee}(${argsText})`));
	}
	return edits;
}

/**
 * Iterate over call expressions of a specific identifier and generate edits.
 *
 * @param {SgNode} root - The root of the AST.
 * @param {string} identifierName - The identifier being called.
 * @param {string} methodName - The native method name to replace with (e.g., 'concat').
 * @param {((args: SgNode[]) => boolean)} shouldTransform - Function that receives args and returns whether to transform.
 * @returns {Edit[]}
 */
export function computePolyfillMethodCallReplacementEdits(
	root,
	identifierName,
	methodName,
	shouldTransform,
) {
	/** @type {Edit[]} */
	const edits = [];
	const callExpressions = root.findAll({
		rule: {
			pattern: `${identifierName}($$$ARGS)`,
		},
	});

	for (const call of callExpressions) {
		const argsMatch = call.getMultipleMatches('ARGS');
		if (!argsMatch) continue;

		const args = argsMatch.filter((m) => m.kind() !== ',');

		if (!shouldTransform(args)) continue;

		const callee = args[0].text();
		const methodArgs = args
			.slice(1)
			.map((m) => m.text())
			.join(', ');

		edits.push(call.replace(`${callee}.${methodName}(${methodArgs})`));
	}

	return edits;
}

/**
 * Find all default imports/requires for a package and extract common metadata.
 *
 * @param {SgNode} root - The root of the AST.
 * @param {string} fromPackage - The package to find imports for.
 * @returns {{ imports: SgNode[], localNames: string[], quoteType: string }}
 */
function findDefaultImports(root, fromPackage) {
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

	/** @type {string[]} */
	const localNames = [];
	let quoteType = "'";

	for (const imp of imports) {
		const nameMatch = imp.getMatch('NAME');
		if (!nameMatch) continue;
		localNames.push(nameMatch.text());
		const impText = imp.text();
		if (impText.includes('"')) quoteType = '"';
	}

	return { imports, localNames, quoteType };
}

/**
 * Replace a default import/require of one package with a named import from another package.
 *
 * @param {SgNode} root - The root of the AST.
 * @param {string} fromPackage - The package being replaced
 * @param {string} toPackage - The new package specifier
 * @param {string} namedImport - The named import to use (e.g., 'stripVTControlCharacters')
 * @returns {{ edits: Edit[], localNames: string[], quoteType: string }}
 */
export function replaceDefaultWithNamedImport(
	root,
	fromPackage,
	toPackage,
	namedImport,
) {
	const { imports, localNames, quoteType } = findDefaultImports(
		root,
		fromPackage,
	);

	/** @type {Edit[]} */
	const edits = [];

	for (const imp of imports) {
		const nameMatch = imp.getMatch('NAME');
		if (!nameMatch) continue;

		const isCommonJS = imp.find('require($SOURCE)') !== null;

		if (isCommonJS) {
			edits.push(
				imp.replace(
					`const { ${namedImport} } = require(${quoteType}${toPackage}${quoteType});`,
				),
			);
		} else {
			edits.push(
				imp.replace(
					`import { ${namedImport} } from ${quoteType}${toPackage}${quoteType};`,
				),
			);
		}
	}

	return { edits, localNames, quoteType };
}

/**
 * Replace a default import/require of one package with another.
 * If toIdentifier is not provided, the original local name is preserved.
 *
 * @param {SgNode} root - The root of the AST.
 * @param {string} fromPackage - The package being replaced
 * @param {string} toPackage - The new package specifier
 * @param {string} [toIdentifier] - The local name to use in the replacement (defaults to original name)
 * @returns {{ edits: Edit[], localNames: string[], quoteType: string }}
 */
export function replaceDefaultImport(
	root,
	fromPackage,
	toPackage,
	toIdentifier,
) {
	const { imports, localNames, quoteType } = findDefaultImports(
		root,
		fromPackage,
	);

	/** @type {Edit[]} */
	const edits = [];

	for (const imp of imports) {
		const nameMatch = imp.getMatch('NAME');
		if (!nameMatch) continue;

		const identifier = toIdentifier || nameMatch.text();
		const isCommonJS = imp.find('require($SOURCE)') !== null;

		if (isCommonJS) {
			edits.push(
				imp.replace(
					`const ${identifier} = require(${quoteType}${toPackage}${quoteType});`,
				),
			);
		} else {
			edits.push(
				imp.replace(
					`import ${identifier} from ${quoteType}${toPackage}${quoteType};`,
				),
			);
		}
	}

	return { edits, localNames, quoteType };
}
