import jscodeshift from 'jscodeshift';
import { removeImport } from '../shared.js';

/** @import { Codemod } from '../../types.js' **/

/**
 * @returns {Codemod}
 */
export default function () {
	return {
		name: 'is-number',
		to: 'native',
		transform: ({ file, options }) => {
			const j = jscodeshift;
			const root = j(file.source);
			let dirtyFlag = false;

			const { identifier } = removeImport('is-number', root, j);

			root
				.find(j.CallExpression, {
					callee: {
						type: 'Identifier',
						name: identifier,
					},
				})
				.replaceWith((path) => {
					const arg = path.node.arguments[0];
					dirtyFlag = true;
					// Construct the detailed check
					const detailedCheck = j.logicalExpression(
						'||',
						j.binaryExpression(
							'===',
							// @ts-expect-error
							j.unaryExpression('typeof', arg, true),
							j.literal('number'),
						),
						j.logicalExpression(
							'&&',
							j.binaryExpression(
								'===',
								// @ts-expect-error
								j.unaryExpression('typeof', arg, true),
								j.literal('string'),
							),
							j.callExpression(
								j.memberExpression(
									j.identifier('Number'),
									j.identifier('isFinite'),
								),
								// @ts-expect-error
								[j.unaryExpression('+', arg, true)],
							),
						),
					);
					return j.parenthesizedExpression(detailedCheck);
				});

			return dirtyFlag ? root.toSource(options) : file.source;
		},
	};
}
