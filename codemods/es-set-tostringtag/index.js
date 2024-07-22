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
		name: 'es-set-tostringtag',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);
			let dirtyFlag = false;

			const { identifier } = removeImport('es-set-tostringtag', root, j);

			root
				.find(j.CallExpression, {
					callee: {
						type: 'Identifier',
						name: identifier,
					},
				})
				.forEach((path) => {
					const args = path.value.arguments;
					const arg =
						args[1].type === 'SpreadElement' ? args[1].argument : args[1];

					const newExpression = j.callExpression(
						j.memberExpression(
							j.identifier('Object'),
							j.identifier('defineProperty'),
						),
						[
							args[0],
							j.memberExpression(
								j.identifier('Symbol'),
								j.identifier('toStringTag'),
							),
							j.objectExpression([
								j.property(
									'init',
									j.identifier('configurable'),
									j.booleanLiteral(true),
								),
								j.property('init', j.identifier('value'), arg),
							]),
						],
					);
					j(path).replaceWith(newExpression);
					dirtyFlag = true;
				});

			return dirtyFlag ? root.toSource(options) : file.source;
		},
	};
}
