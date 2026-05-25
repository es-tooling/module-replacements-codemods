import { ts } from '@ast-grep/napi';
import { findNamedImports, removeImport } from '../shared-ast-grep.js';

/**
 * @typedef {import('../../types.js').Codemod} Codemod
 * @typedef {import('../../types.js').CodemodOptions} CodemodOptions
 * @typedef {import('@ast-grep/napi').SgNode} SgNode
 * @typedef {import('@ast-grep/napi').Edit} Edit
 */

const IS_NPM_EXPR =
	'process.env.npm_config_user_agent && process.env.npm_config_user_agent.startsWith("npm") || process.env.npm_package_json && process.env.npm_package_json.endsWith("package.json")';
const IS_YARN_EXPR =
	'process.env.npm_config_user_agent && process.env.npm_config_user_agent.startsWith("yarn")';
const IS_NPM_OR_YARN_EXPR = `${IS_NPM_EXPR} || ${IS_YARN_EXPR}`;

/** @type {Record<string, string>} */
const EXPR_FOR_EXPORT = {
	isNpm: IS_NPM_EXPR,
	isYarn: IS_YARN_EXPR,
	isNpmOrYarn: IS_NPM_OR_YARN_EXPR,
};

const MODULE_NAME = 'is-npm';

/**
 * Collect locals that bind the whole module object - `import * as X from 'is-npm'`
 * and non-destructured `const X = require('is-npm')`. Member accesses on these
 * (e.g. `X.isNpm`) are what we want to rewrite.
 *
 * @param {SgNode} root
 * @returns {string[]}
 */
function findNamespaceNames(root) {
	/** @type {string[]} */
	const names = [];

	const esmNS = root.findAll({
		rule: {
			pattern: {
				context: `import * as $NAME from '${MODULE_NAME}'`,
				strictness: 'relaxed',
			},
		},
	});
	for (const imp of esmNS) {
		const name = imp.getMatch('NAME')?.text();
		if (name) names.push(name);
	}

	for (const decl of ['const', 'var', 'let']) {
		const cjsDefault = root.findAll({
			rule: {
				pattern: {
					context: `${decl} $NAME = require('${MODULE_NAME}')`,
					strictness: 'relaxed',
				},
			},
		});
		for (const imp of cjsDefault) {
			const name = imp.getMatch('NAME')?.text();
			if (name) names.push(name);
		}
	}

	return names;
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

			const { edits } = removeImport(root, MODULE_NAME);
			const { exportToLocal } = findNamedImports(root, MODULE_NAME);
			const namespaceNames = findNamespaceNames(root);

			for (const [exportName, localName] of Object.entries(exportToLocal)) {
				const expr = EXPR_FOR_EXPORT[exportName];
				if (!expr) continue;
				const usages = root.findAll({
					rule: { kind: 'identifier', pattern: localName },
				});
				for (const usage of usages) {
					edits.push(usage.replace(expr));
				}
			}

			for (const ns of namespaceNames) {
				for (const exportName of Object.keys(EXPR_FOR_EXPORT)) {
					const expr = EXPR_FOR_EXPORT[exportName];
					const memberExprs = root.findAll({
						rule: { pattern: `${ns}.${exportName}` },
					});
					for (const member of memberExprs) {
						edits.push(member.replace(expr));
					}
				}
			}

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
