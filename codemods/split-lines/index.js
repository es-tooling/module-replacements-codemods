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
		name: 'split-lines',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);
			let isDirty = false;

			const { identifier } = removeImport('split-lines', root, j);

			root
				.find(j.CallExpression, { callee: { name: identifier } })
				.replaceWith((path) => {
					const { node } = path;
					const [stringArg, optionsArg] = node.arguments;

					if (stringArg && stringArg.type !== 'Literal') {
						return;
					}

					if (optionsArg && optionsArg.type !== 'ObjectExpression') {
						return;
					}

					isDirty = true;

					const defaultCallExpression = j.callExpression(
						j.memberExpression(stringArg, j.identifier('split')),
						[j.literal(/\r?\n/)],
					);

					const hasPreserveNewlines = optionsArg?.properties.some(
						(prop) =>
							prop.type === 'Property' &&
							prop.key.type === 'Identifier' &&
							prop.key.name === 'preserveNewlines',
					);

					if (hasPreserveNewlines) {
						return j.callExpression(
							j.memberExpression(
								j.callExpression(
									j.memberExpression(stringArg, j.identifier('split')),
									[j.literal(/(\r?\n)/)],
								),
								j.identifier('reduce'),
							),
							[
								j.arrowFunctionExpression(
									[
										j.identifier('acc'),
										j.identifier('part'),
										j.identifier('index'),
										j.identifier('array'),
									],
									j.blockStatement([
										j.ifStatement(
											j.binaryExpression(
												'===',
												j.binaryExpression(
													'%',
													j.identifier('index'),
													j.literal(2),
												),
												j.literal(0),
											),
											j.blockStatement([
												j.expressionStatement(
													j.callExpression(
														j.memberExpression(
															j.identifier('acc'),
															j.identifier('push'),
														),
														[
															j.binaryExpression(
																'+',
																j.identifier('part'),
																j.logicalExpression(
																	'||',
																	j.memberExpression(
																		j.identifier('array'),
																		j.binaryExpression(
																			'+',
																			j.identifier('index'),
																			j.literal(1),
																		),
																		true,
																	),
																	j.literal(''),
																),
															),
														],
													),
												),
											]),
										),
										j.returnStatement(j.identifier('acc')),
									]),
									false,
								),
								j.arrayExpression([]),
							],
						);
					}

					return defaultCallExpression;
				});

			return isDirty ? root.toSource(options) : file.source;
		},
	};
}
