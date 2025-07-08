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
		name: 'has-symbols',
		to: 'native',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);
			let dirtyFlag = false;

			const { identifier } = removeImport('has-symbols', root, j);
			const { identifier: identifierShams } = removeImport(
				'has-symbols/shams',
				root,
				j,
			);
			[identifier, identifierShams].forEach((identifier) => {
				root
					.find(j.CallExpression, {
						callee: {
							type: 'Identifier',
							name: identifier,
						},
					})
					.forEach((path) => {
						const newExpression = j.booleanLiteral(true);

						j(path).replaceWith(newExpression);
						dirtyFlag = true;
					});
			});
			return dirtyFlag ? root.toSource(options) : file.source;
		},
	};
}
