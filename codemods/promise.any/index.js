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
		name: 'promise.any',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);
			let dirtyFlag = false;

			const { identifier } = removeImport('promise.any', root, j);

			root
				.find(j.CallExpression, {
					callee: {
						type: 'Identifier',
						name: identifier,
					},
				})
				.forEach((path) => {
					const args = path.value.arguments;
					if (args.length === 1) {
						const newExpression = j.callExpression(
							j.memberExpression(j.identifier('Promise'), j.identifier('any')),
							//@ts-ignore
							args,
						);
						j(path).replaceWith(newExpression);
						dirtyFlag = true;
					}
				});

			return dirtyFlag ? root.toSource(options) : file.source;
		},
	};
}
