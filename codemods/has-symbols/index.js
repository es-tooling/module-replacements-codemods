import jscodeshift from 'jscodeshift';
import { removeImport } from '../shared.js';

/** @import { Codemod, CodemodOptions } from '../../types.js' **/

/**
 * @returns {Codemod}
 */
export default function () {
	return {
		name: 'has-symbols',
		transform: ({ file, options }) => {
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
