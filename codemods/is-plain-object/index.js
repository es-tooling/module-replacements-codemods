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
		name: 'is-plain-object',
		to: 'native',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);
			let isDirty = false;

			const { identifier } = removeImport('is-plain-object', root, j);

			if (identifier) {
				const callExpressions = root.find(j.CallExpression, {
					callee: {
						name: identifier,
					},
				});

				for (const path of callExpressions.paths()) {
					const args = path.value.arguments;
					if (args.length > 0) {
						isDirty = true;

						const arg =
							args[0].type === 'SpreadElement' ? args[0].argument : args[0];

						const newExpression = j.callExpression(
							j.arrowFunctionExpression(
								[j.identifier('v')],
								j.blockStatement([
									j.returnStatement(
										j.unaryExpression(
											'!',
											j.unaryExpression(
												'!',
												j.logicalExpression(
													'&&',
													j.identifier('v'),
													j.logicalExpression(
														'&&',
														j.binaryExpression(
															'===',
															j.unaryExpression('typeof', j.identifier('v')),
															j.literal('object'),
														),
														j.parenthesizedExpression(
															j.logicalExpression(
																'||',
																j.binaryExpression(
																	'===',
																	j.callExpression(
																		j.memberExpression(
																			j.identifier('Object'),
																			j.identifier('getPrototypeOf'),
																		),
																		[j.identifier('v')],
																	),
																	j.literal(null),
																),
																j.binaryExpression(
																	'===',
																	j.callExpression(
																		j.memberExpression(
																			j.identifier('Object'),
																			j.identifier('getPrototypeOf'),
																		),
																		[j.identifier('v')],
																	),
																	j.memberExpression(
																		j.identifier('Object'),
																		j.identifier('prototype'),
																	),
																),
															),
														),
													),
												),
											),
										),
									),
								]),
							),
							[arg],
						);

						j(path).replaceWith(newExpression);
					}
				}
			}

			return isDirty ? root.toSource(options) : file.source;
		},
	};
}
