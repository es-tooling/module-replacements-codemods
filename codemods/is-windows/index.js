import jscodeshift from 'jscodeshift';
import { removeImport } from '../shared.js';

/** @import { Codemod } from '../../types.js' **/

/**
 * @returns {Codemod}
 */
export default function () {
	return {
		name: 'is-windows',
		transform: ({ file, options }) => {
			const j = jscodeshift;
			const root = j(file.source);
			let dirtyFlag = false;

			const { identifier } = removeImport('is-windows', root, j);
			root
				.find(j.CallExpression, {
					callee: {
						type: 'Identifier',
						name: identifier,
					},
				})
				.forEach((path) => {
					dirtyFlag = true;
					j(path).replaceWith(
						j.binaryExpression(
							'===',
							j.memberExpression(
								j.identifier('process'),
								j.identifier('platform'),
							),
							j.literal('win32'),
						),
					);
				});
			return dirtyFlag ? root.toSource(options) : file.source;
		},
	};
}
