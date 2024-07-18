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
		name: 'gopd',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);
			let dirtyFlag = false;

			const { identifier } = removeImport('gopd', root, j);

			root
				.find(j.UnaryExpression, {
					operator: 'typeof',
					argument: {
						type: 'Identifier',
						name: identifier,
					},
				})
				.forEach((path) => {
					const newExpression = j.unaryExpression(
						'typeof',
						j.memberExpression(
							j.identifier('Object'),
							j.identifier('getOwnPropertyDescriptor'),
						),
					);

					j(path).replaceWith(newExpression);
					dirtyFlag = true;
				});

			root
				.find(j.CallExpression, {
					callee: {
						type: 'Identifier',
						name: identifier,
					},
				})
				.forEach((path) => {
					const args = path.value.arguments;
					const newExpression = j.callExpression(
						j.memberExpression(
							j.identifier('Object'),
							j.identifier('getOwnPropertyDescriptor'),
						),
						//@ts-ignore
						args,
					);
					j(path).replaceWith(newExpression);
					dirtyFlag = true;
				});

			return dirtyFlag ? root.toSource(options) : file.source;
		},
	};
}
