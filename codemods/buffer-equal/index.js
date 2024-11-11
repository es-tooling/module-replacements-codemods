import jscodeshift from 'jscodeshift';
import {
	DEFAULT_IMPORT,
	getImportIdentifierMap,
	removeImport,
} from '../shared.js';

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
		name: 'buffer-equal',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);
			let transformCount = 0;
			let dirtyFlag = false;

			const map = getImportIdentifierMap('buffer-equal', root, j);

			const identifier = map[DEFAULT_IMPORT];

			const callExpressions = root.find(j.CallExpression, {
				callee: {
					name: identifier,
				},
			});

			if (!callExpressions.length) {
				removeImport('buffer-equal', root, j);
				return root.toSource(options);
			}

			callExpressions.forEach((p) => {
				const args = p.node.arguments;
				if (args.length === 2 && args[0].type !== 'SpreadElement') {
					const [firstArg, secondArg] = args;
					j(p).replaceWith(
						j.callExpression(
							j.memberExpression(firstArg, j.identifier('equals')),
							[secondArg],
						),
					);
					dirtyFlag = true;
					transformCount++;
				}
			});

			if (transformCount === callExpressions.length) {
				removeImport('buffer-equal', root, j);
			}

			return dirtyFlag ? root.toSource(options) : file.source;
		},
	};
}
