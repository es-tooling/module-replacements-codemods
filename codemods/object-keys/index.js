import jscodeshift from 'jscodeshift';
import { removeImport } from '../shared.js';

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
		name: 'object-keys',
		to: 'native',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);

			let { identifier } = removeImport('object-keys', root, j);

			// Replace `$identifier(obj)` with `Object.keys(obj)`
			root
				.find(j.CallExpression, {
					callee: {
						name: identifier,
					},
				})
				.replaceWith(({ node }) => {
					return j.callExpression(
						j.memberExpression(j.identifier('Object'), j.identifier('keys')),
						node.arguments,
					);
				});

			// Remove recommended usage of `var keys = Object.keys || require("object-keys")`
			const logicalExpressionRequire = root.find(j.VariableDeclarator, {
				init: {
					type: 'LogicalExpression',
					left: {
						object: {
							name: 'Object',
						},
						property: {
							name: 'keys',
						},
					},
					right: {
						callee: {
							name: 'require',
						},
						arguments: [
							{
								value: 'object-keys',
							},
						],
					},
				},
			});

			identifier =
				logicalExpressionRequire.paths().length > 0
					? logicalExpressionRequire.get().node.id.name
					: null;

			logicalExpressionRequire.remove();

			// Replace `$identifier(obj)` with `Object.keys(obj)`
			root
				.find(j.CallExpression, {
					callee: {
						name: identifier,
					},
				})
				.replaceWith(({ node }) => {
					return j.callExpression(
						j.memberExpression(j.identifier('Object'), j.identifier('keys')),
						node.arguments,
					);
				});

			return root.toSource(options);
		},
	};
}
