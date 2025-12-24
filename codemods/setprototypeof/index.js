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
		name: 'setprototypeof',
		to: 'native',
		transform: ({ file }) => {
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
