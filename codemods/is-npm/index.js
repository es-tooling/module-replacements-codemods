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
		name: 'is-npm',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);
			let isDirty = false;

			const { identifier } = removeImport('is-npm', root, j);

			if (identifier) {
				isDirty = true;

				root
					.find(j.Identifier, { name: 'isNpm' })
					.replaceWith(
						j.logicalExpression(
							'||',
							j.logicalExpression(
								'&&',
								j.memberExpression(
									j.memberExpression(
										j.identifier('process'),
										j.identifier('env'),
									),
									j.identifier('npm_config_user_agent'),
								),
								j.callExpression(
									j.memberExpression(
										j.memberExpression(
											j.memberExpression(
												j.identifier('process'),
												j.identifier('env'),
											),
											j.identifier('npm_config_user_agent'),
										),
										j.identifier('startsWith'),
									),
									[j.literal('npm')],
								),
							),
							j.logicalExpression(
								'&&',
								j.memberExpression(
									j.memberExpression(
										j.identifier('process'),
										j.identifier('env'),
									),
									j.identifier('npm_package_json'),
								),
								j.callExpression(
									j.memberExpression(
										j.memberExpression(
											j.memberExpression(
												j.identifier('process'),
												j.identifier('env'),
											),
											j.identifier('npm_package_json'),
										),
										j.identifier('endsWith'),
									),
									[j.literal('package.json')],
								),
							),
						),
					);

				root
					.find(j.Identifier, { name: 'isYarn' })
					.replaceWith(
						j.logicalExpression(
							'&&',
							j.memberExpression(
								j.memberExpression(
									j.identifier('process'),
									j.identifier('env'),
								),
								j.identifier('npm_config_user_agent'),
							),
							j.callExpression(
								j.memberExpression(
									j.memberExpression(
										j.memberExpression(
											j.identifier('process'),
											j.identifier('env'),
										),
										j.identifier('npm_config_user_agent'),
									),
									j.identifier('startsWith'),
								),
								[j.literal('yarn')],
							),
						),
					);

				root
					.find(j.Identifier, { name: 'isNpmOrYarn' })
					.replaceWith(
						j.logicalExpression(
							'||',
							j.logicalExpression(
								'||',
								j.logicalExpression(
									'&&',
									j.memberExpression(
										j.memberExpression(
											j.identifier('process'),
											j.identifier('env'),
										),
										j.identifier('npm_config_user_agent'),
									),
									j.callExpression(
										j.memberExpression(
											j.memberExpression(
												j.memberExpression(
													j.identifier('process'),
													j.identifier('env'),
												),
												j.identifier('npm_config_user_agent'),
											),
											j.identifier('startsWith'),
										),
										[j.literal('npm')],
									),
								),
								j.logicalExpression(
									'&&',
									j.memberExpression(
										j.memberExpression(
											j.identifier('process'),
											j.identifier('env'),
										),
										j.identifier('npm_package_json'),
									),
									j.callExpression(
										j.memberExpression(
											j.memberExpression(
												j.memberExpression(
													j.identifier('process'),
													j.identifier('env'),
												),
												j.identifier('npm_package_json'),
											),
											j.identifier('endsWith'),
										),
										[j.literal('package.json')],
									),
								),
							),
							j.logicalExpression(
								'&&',
								j.memberExpression(
									j.memberExpression(
										j.identifier('process'),
										j.identifier('env'),
									),
									j.identifier('npm_config_user_agent'),
								),
								j.callExpression(
									j.memberExpression(
										j.memberExpression(
											j.memberExpression(
												j.identifier('process'),
												j.identifier('env'),
											),
											j.identifier('npm_config_user_agent'),
										),
										j.identifier('startsWith'),
									),
									[j.literal('yarn')],
								),
							),
						),
					);
			}

			return isDirty ? root.toSource(options) : file.source;
		},
	};
}
