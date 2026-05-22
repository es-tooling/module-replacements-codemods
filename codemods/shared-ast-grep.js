/**
 * @typedef {import('@ast-grep/napi').SgNode} SgNode
 * @typedef {import('@ast-grep/napi').Edit} Edit
 */

/**
 * Find all default imports/requires for a package and extract common metadata.
 *
 * @param {SgNode} root - The root of the AST.
 * @param {string} moduleName - The package to find imports for.
 * @returns {{ imports: SgNode[], localNames: string[], quoteType: string }}
 */
function findNamedDefaultImports(root, moduleName) {
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
				{
					pattern: {
						context: `$NAME = require('${moduleName}')`,
						strictness: 'relaxed',
					},
				},
				{
					pattern: {
						context: `$NAME = require('${moduleName}');`,
						strictness: 'relaxed',
					},
				},
			],
		},
	});

	/** @type {string[]} */
	const localNames = [];
	let quoteType = "'";

	for (let i = imports.length - 1; i >= 0; i--) {
		const imp = imports[i];
		const nameMatch = imp.getMatch('NAME');
		if (
			!nameMatch ||
			imp.find({ rule: { kind: 'named_imports' } }) ||
			imp.find({ rule: { kind: 'object_pattern' } })
		) {
			imports.splice(i, 1);
			continue;
		}
		localNames.push(nameMatch.text());
		const impText = imp.text();
		if (impText.includes('"')) quoteType = '"';
	}

	return { imports, localNames, quoteType };
}

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
export function findNamedImports(root, moduleName) {
	/** @type {SgNode[]} */
	const imports = [];
	/** @type {string[]} */
	const localNames = [];
	/** @type {Record<string, string>} */
	const exportToLocal = {};

	// 1. Handle named ESM imports: import { X as Y } from 'pkg'
	const namedEsm = root.findAll({
		rule: {
			pattern: {
				context: `import { $$$SPECS } from '${moduleName}'`,
				strictness: 'relaxed',
			},
		},
	});
	for (const imp of namedEsm) {
		imports.push(imp);
		const specs = imp
			.getMultipleMatches('SPECS')
			.filter((m) => m.kind() !== ',');
		for (const spec of specs) {
			const alias = spec.field('alias');
			const name = spec.field('name');
			const exported = name.text();
			const local = alias ? alias.text() : exported;
			localNames.push(local);
			exportToLocal[exported] = local;
		}
	}

	// 2. Handle CJS destructured requires: const { X } = require('pkg')
	for (const decl of ['const', 'var', 'let']) {
		const cjsDestruct = root.findAll({
			rule: {
				pattern: {
					context: `${decl} { $$$PROPS } = require('${moduleName}')`,
					strictness: 'relaxed',
				},
			},
		});
		for (const imp of cjsDestruct) {
			imports.push(imp);
			const props = imp
				.getMultipleMatches('PROPS')
				.filter((m) => m.kind() !== ',');
			for (const prop of props) {
				const key = prop.field('key');
				const value = prop.field('value');
				const exported = key ? key.text() : prop.text();
				const local = value ? value.text() : prop.text();
				localNames.push(local);
				exportToLocal[exported] = local;
			}
		}
	}

	return { imports, localNames, exportToLocal };
}

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
export function removeImport(root, moduleName) {
	/** @type {Edit[]} */
	const edits = [];
	/** @type {string[]} */
	const localNames = [];

	// 1. Default imports/requires and assignments
	const { imports, localNames: defaultLocalNames } = findNamedDefaultImports(
		root,
		moduleName,
	);

	for (const imp of imports) {
		edits.push(imp.replace(''));
	}
	localNames.push(...defaultLocalNames);

	// 2. Named ESM and destructured CJS imports
	const { imports: namedImports, localNames: namedLocalNames } =
		findNamedImports(root, moduleName);
	for (const imp of namedImports) {
		edits.push(imp.replace(''));
	}
	localNames.push(...namedLocalNames);

	// 3. Handle ESM side-effect imports: import 'pkg'
	const esmSideEffects = root.findAll({
		rule: {
			pattern: {
				context: `import '${moduleName}'`,
				strictness: 'relaxed',
			},
		},
	});
	for (const imp of esmSideEffects) {
		edits.push(imp.replace(''));
	}

	// 4. Handle CJS side-effect expressions: require('pkg')
	const cjsSideEffects = root.findAll({
		rule: {
			kind: 'expression_statement',
			has: {
				pattern: {
					context: `require('${moduleName}')`,
					strictness: 'relaxed',
				},
				not: {
					any: [
						{ inside: { kind: 'variable_declarator' } },
						{ inside: { kind: 'assignment_expression' } },
					],
				},
			},
		},
	});

	for (const imp of cjsSideEffects) {
		edits.push(imp.replace(''));
	}

	return { edits, localNames };
}

/**
 * Find default imports of a module and resolve the local identifier name.
 *
 * @param {SgNode} root - The root of the AST.
 * @param {string} moduleName - The module to find imports for.
 * @returns {{ imports: SgNode[], identifierName: string | null }}
 */
export function findDefaultImportIdentifier(root, moduleName) {
	const { imports } = findNamedDefaultImports(root, moduleName);
	const identifierName = imports[0]?.getMatch('NAME')?.text() ?? null;
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
export function replaceDefaultImport(
	root,
	fromPackage,
	toPackage,
	toIdentifier,
	asNamespace = false,
) {
	const { imports, localNames, quoteType } = findNamedDefaultImports(
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
			const prefix = asNamespace ? 'import * as ' : 'import ';
			edits.push(
				imp.replace(
					`${prefix}${identifier} from ${quoteType}${toPackage}${quoteType};`,
				),
			);
		}
	}

	return { edits, localNames, quoteType };
}

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
export function replacePolyfillUsage(root, moduleName, replacement) {
	const { edits, localNames } = removeImport(root, moduleName);
	const identifierName = localNames[0];
	if (!identifierName) return { edits };
	const usages = root.findAll({
		rule: {
			kind: 'identifier',
			pattern: identifierName,
		},
	});
	for (const usage of usages) {
		edits.push(usage.replace(replacement));
	}
	return { edits };
}

/**
 * Compute edits that replace every call of `identifierName(arg)` with
 * `arg.propertyName`, converting a polyfill function call to a native property access.
 *
 * @param {SgNode} root - The root of the AST.
 * @param {string} identifierName - The identifier currently being called.
 * @param {string} propertyName - The native property name to replace with (e.g., 'length').
 * @returns {Edit[]}
 */
export function computePolyfillPropertyReplacementEdits(
	root,
	identifierName,
	propertyName,
) {
	/** @type {Edit[]} */
	const edits = [];
	const calls = root.findAll({
		rule: { pattern: `${identifierName}($ARG)` },
	});
	for (const call of calls) {
		const arg = call.getMatch('ARG');
		if (arg) {
			edits.push(call.replace(`${arg.text()}.${propertyName}`));
		}
	}
	return edits;
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
	const { imports, localNames, quoteType } = findNamedDefaultImports(
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

	const namespaceImports = root.findAll({
		rule: {
			pattern: {
				context: `import * as $NS from '${fromPackage}'`,
				strictness: 'relaxed',
			},
		},
	});

	for (const imp of namespaceImports) {
		const nsName = imp.getMatch('NS')?.text();
		if (!nsName) continue;

		const aliases = root.findAll({
			rule: {
				any: [
					{ pattern: { context: `const $NAME = ${nsName}.default` } },
					{ pattern: { context: `const { default: $NAME } = ${nsName}` } },
				],
			},
		});

		for (const decl of aliases) {
			const nameMatch = decl.getMatch('NAME');
			if (nameMatch) {
				localNames.push(nameMatch.text());
				edits.push(decl.replace(''));
			}
		}

		edits.push(
			imp.replace(
				`import { ${namedImport} } from ${quoteType}${toPackage}${quoteType};`,
			),
		);
	}

	return { edits, localNames, quoteType };
}
