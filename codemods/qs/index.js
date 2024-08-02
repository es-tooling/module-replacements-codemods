import jscodeshift from 'jscodeshift';

/**
 * @typedef {import('../../types.js').Codemod} Codemod
 * @typedef {import('../../types.js').CodemodOptions} CodemodOptions
 */

/**
 * @param {CodemodOptions} [options]
 * @returns {Codemod}
 */
export default function (options) {
	return {
		name: 'traverse',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);

			// Transform all import 'qs' to 'neoqs/legacy'
			root.find(j.ImportDeclaration, { source: { value: 'qs' } }).forEach((path) => {
				path.node.source.value = 'neoqs/legacy';

				// If it's a default import, change it to import * as
				if (
					path.node.specifiers?.length === 1 &&
					j.ImportDefaultSpecifier.check(path.node.specifiers[0])
				) {
					const specifier = path.node.specifiers[0];
					path.node.specifiers = [j.importNamespaceSpecifier(specifier.local)];
				}
			});

			// Transform const traverse = require('qs');
			root.find(j.CallExpression, { callee: { name: 'require' } }).forEach((path) => {
				if (j.Literal.check(path.node.arguments[0]) && path.node.arguments[0].value === 'qs') {
					path.node.arguments[0].value = 'neoqs/legacy';
				}
			});

			return root.toSource();
		},
	};
}
