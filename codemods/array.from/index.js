import jscodeshift from 'jscodeshift';
import { removeImport } from '../shared.js';

/** @import { Codemod, CodemodOptions } from '../../types.js' **/

/**
 * @returns {Codemod}
 */
export default function () {
	return {
		name: 'array.from',
		transform: ({ file, options }) => {
			const j = jscodeshift;
			const root = j(file.source);
			let dirtyFlag = false;

			const { identifier } = removeImport('array.from', root, j);

			root
				.find(j.CallExpression, {
					callee: { name: identifier },
				})
				.forEach((p) => {
					dirtyFlag = true;
					j(p).replaceWith(
						j.callExpression(
							j.memberExpression(j.identifier('Array'), j.identifier('from')),
							p.value.arguments,
						),
					);
				});

			return dirtyFlag ? root.toSource(options) : file.source;
		},
	};
}
