import jscodeshift from 'jscodeshift';
import { removeImport } from '../shared.js';

/** @import { Codemod, CodemodOptions } from '../../types.js' **/

/**
 * @returns {Codemod}
 */
export default function () {
	return {
		name: 'setprototypeof',
		transform: ({ file, options }) => {
			const j = jscodeshift;
			const root = j(file.source);
			let dirtyFlag = false;

			const { identifier } = removeImport('setprototypeof', root, j);

			if (identifier) {
				const callExpressions = root.find(j.CallExpression, {
					callee: { name: identifier },
				});

				for (const path of callExpressions.paths()) {
					j(path).replaceWith(
						j.callExpression(
							j.memberExpression(
								j.identifier('Object'),
								j.identifier('setPrototypeOf'),
							),
							path.node.arguments,
						),
					);
					dirtyFlag = true;
				}
			}

			return dirtyFlag ? root.toSource(options) : file.source;
		},
	};
}
