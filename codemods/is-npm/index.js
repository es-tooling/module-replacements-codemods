import jscodeshift from 'jscodeshift';
import {
	getImportIdentifierMap,
	NAMESPACE_IMPORT,
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
		name: 'is-npm',
		to: 'native',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);
			let isDirty = false;

			const identifiers = getImportIdentifierMap('is-npm', root, j);

			const isNpmLogicalExpression = j.logicalExpression(
				'||',
				j.logicalExpression(
					'&&',
					j.memberExpression(
						j.memberExpression(j.identifier('process'), j.identifier('env')),
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
						j.memberExpression(j.identifier('process'), j.identifier('env')),
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
			);

			const isYarnLogicalExpression = j.logicalExpression(
				'&&',
				j.memberExpression(
					j.memberExpression(j.identifier('process'), j.identifier('env')),
					j.identifier('npm_config_user_agent'),
				),
				j.callExpression(
					j.memberExpression(
						j.memberExpression(
							j.memberExpression(j.identifier('process'), j.identifier('env')),
							j.identifier('npm_config_user_agent'),
						),
						j.identifier('startsWith'),
					),
					[j.literal('yarn')],
				),
			);

			const isNpmOrYarnLogicalExpression = j.logicalExpression(
				'||',
				isNpmLogicalExpression,
				isYarnLogicalExpression,
			);

			root
				.find(j.Identifier, { name: identifiers.isNpm })
				.forEach(() => (isDirty = true))
				.replaceWith(isNpmLogicalExpression);

			if (identifiers[NAMESPACE_IMPORT]) {
				root
					.find(j.MemberExpression, {
						object: {
							name: identifiers[NAMESPACE_IMPORT],
							type: 'Identifier',
						},
						property: {
							name: 'isNpm',
							type: 'Identifier',
						},
					})
					.forEach(() => (isDirty = true))
					.replaceWith(isNpmLogicalExpression);
			}

			root
				.find(j.Identifier, { name: identifiers.isYarn })
				.forEach(() => (isDirty = true))
				.replaceWith(isYarnLogicalExpression);

			if (identifiers[NAMESPACE_IMPORT]) {
				root
					.find(j.MemberExpression, {
						object: {
							name: identifiers[NAMESPACE_IMPORT],
							type: 'Identifier',
						},
						property: {
							name: 'isYarn',
							type: 'Identifier',
						},
					})
					.forEach(() => (isDirty = true))
					.replaceWith(isYarnLogicalExpression);
			}

			root
				.find(j.Identifier, { name: identifiers.isNpmOrYarn })
				.forEach(() => (isDirty = true))
				.replaceWith(isNpmOrYarnLogicalExpression);

			if (identifiers[NAMESPACE_IMPORT]) {
				root
					.find(j.MemberExpression, {
						object: {
							name: identifiers[NAMESPACE_IMPORT],
							type: 'Identifier',
						},
						property: {
							name: 'isNpmOrYarn',
							type: 'Identifier',
						},
					})
					.forEach(() => (isDirty = true))
					.replaceWith(isNpmOrYarnLogicalExpression);
			}

			if (isDirty) {
				removeImport('is-npm', root, j);
			}

			return isDirty ? root.toSource(options) : file.source;
		},
	};
}
