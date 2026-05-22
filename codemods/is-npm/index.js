import { ts } from '@ast-grep/napi';
import { findNamedImports } from '../shared-ast-grep.js';

/**
 * @typedef {import('../../types.js').Codemod} Codemod
 * @typedef {import('../../types.js').CodemodOptions} CodemodOptions
 */

const IS_NPM_EXPR =
	'process.env.npm_config_user_agent && process.env.npm_config_user_agent.startsWith("npm") || process.env.npm_package_json && process.env.npm_package_json.endsWith("package.json")';
const IS_YARN_EXPR =
	'process.env.npm_config_user_agent && process.env.npm_config_user_agent.startsWith("yarn")';
const IS_NPM_OR_YARN_EXPR =
	'process.env.npm_config_user_agent && process.env.npm_config_user_agent.startsWith("npm") || process.env.npm_package_json && process.env.npm_package_json.endsWith("package.json") || process.env.npm_config_user_agent && process.env.npm_config_user_agent.startsWith("yarn")';

/** @type {Record<string, string>} */
const EXPR_FOR_EXPORT = {
	isNpm: IS_NPM_EXPR,
	isYarn: IS_YARN_EXPR,
	isNpmOrYarn: IS_NPM_OR_YARN_EXPR,
};

const MODULE_NAME = 'is-npm';

/**
 * @param {import('@ast-grep/napi').SgNode} node
 * @returns {boolean}
 */
function isInsideIsNpmImport(node) {
	let current = node.parent();
	while (current) {
		const kind = current.kind();
		if (kind === 'program') break;
		if (kind === 'import_declaration') return true;
		if (kind === 'variable_declarator') {
			const init = current.field('value') ?? current.field('init');
			if (
				init &&
				(init.text() === `require('${MODULE_NAME}')` ||
					init.text() === `require("${MODULE_NAME}")`)
			) {
				return true;
			}
		}
		if (kind === 'expression_statement') {
			const text = current.text();
			if (
				text === `require('${MODULE_NAME}')` ||
				text === `require("${MODULE_NAME}")`
			) {
				return true;
			}
		}
		current = current.parent();
	}
	return false;
}

/**
 * @param {import('@ast-grep/napi').SgNode} root
 * @returns {{ edits: import('@ast-grep/napi').Edit[], exportToLocal: Record<string, string>, namespaceNames: string[] }}
 */
function scanImports(root) {
	/** @type {import('@ast-grep/napi').Edit[]} */
	const edits = [];
	/** @type {Record<string, string>} */
	const exportToLocal = {};
	/** @type {string[]} */
	const namespaceNames = [];

	// 1. Named ESM + destructured CJS imports (via shared utility)
	const { imports: namedImports, exportToLocal: namedExportToLocal } =
		findNamedImports(root, MODULE_NAME);
	for (const imp of namedImports) {
		edits.push(imp.replace(''));
	}
	Object.assign(exportToLocal, namedExportToLocal);

	// 2. ESM namespace imports: import * as banana from 'is-npm'
	const esmNS = root.findAll({
		rule: {
			pattern: {
				context: `import * as $NAME from 'is-npm'`,
				strictness: 'relaxed',
			},
		},
	});
	for (const imp of esmNS) {
		const nameMatch = imp.getMatch('NAME');
		if (nameMatch) namespaceNames.push(nameMatch.text());
		edits.push(imp.replace(''));
	}

	// 3. CJS default
	for (const decl of ['const', 'var', 'let']) {
		const cjsDefault = root.findAll({
			rule: {
				pattern: {
					context: `${decl} $NAME = require('is-npm')`,
					strictness: 'relaxed',
				},
			},
		});
		for (const imp of cjsDefault) {
			const nameMatch = imp.getMatch('NAME');
			if (nameMatch) namespaceNames.push(nameMatch.text());
			edits.push(imp.replace(''));
		}
	}

	// 4. Side-effect require: require('is-npm') as expression statement
	const sideEffect = root.findAll({
		rule: {
			pattern: {
				context: `require('is-npm')`,
				strictness: 'relaxed',
			},
			not: {
				inside: { kind: 'variable_declarator' },
			},
		},
	});
	for (const req of sideEffect) {
		edits.push(req.replace(''));
	}

	return { edits, exportToLocal, namespaceNames };
}

/**
 * @param {import('@ast-grep/napi').SgNode} root
 * @param {Record<string, string>} exportToLocal
 * @returns {import('@ast-grep/napi').Edit[]}
 */
function replaceNamedImportUsages(root, exportToLocal) {
	/** @type {import('@ast-grep/napi').Edit[]} */
	const edits = [];

	for (const [exportName, localName] of Object.entries(exportToLocal)) {
		const expr = EXPR_FOR_EXPORT[exportName];
		if (!expr) continue;

		const usages = root.findAll({
			rule: { kind: 'identifier', pattern: localName },
		});
		for (const usage of usages) {
			if (!isInsideIsNpmImport(usage)) {
				edits.push(usage.replace(expr));
			}
		}
	}

	return edits;
}

/**
 * @param {import('@ast-grep/napi').SgNode} root
 * @param {string[]} namespaceNames
 * @returns {import('@ast-grep/napi').Edit[]}
 */
function replaceNamespaceMemberUsages(root, namespaceNames) {
	/** @type {import('@ast-grep/napi').Edit[]} */
	const edits = [];

	for (const ns of namespaceNames) {
		for (const exportName of ['isNpm', 'isYarn', 'isNpmOrYarn']) {
			const expr = EXPR_FOR_EXPORT[exportName];
			if (!expr) continue;

			const memberExprs = root.findAll({
				rule: { pattern: `${ns}.${exportName}` },
			});
			for (const member of memberExprs) {
				edits.push(member.replace(expr));
			}
		}
	}

	return edits;
}

/**
 * @param {CodemodOptions} [options]
 * @returns {Codemod}
 */
export default function (options) {
	return {
		name: MODULE_NAME,
		to: 'native',
		transform: ({ file }) => {
			const ast = ts.parse(file.source);
			const root = ast.root();

			const { edits, exportToLocal, namespaceNames } = scanImports(root);

			const namedEdits = replaceNamedImportUsages(root, exportToLocal);
			edits.push(...namedEdits);

			const nsEdits = replaceNamespaceMemberUsages(root, namespaceNames);
			edits.push(...nsEdits);

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
