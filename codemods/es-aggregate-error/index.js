import jscodeshift from 'jscodeshift';
import { removeImport, transformMathPolyfill } from '../shared.js';

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
		name: 'es-aggregate-error',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);

			const { identifier } = removeImport('es-aggregate-error', root, j);

			const expressions = root.find(j.NewExpression, {
				callee: {
					type: 'Identifier',
					name: identifier,
				},
			});

			if (!expressions.length) return file.source;

			expressions.replaceWith(({ node }) =>
				j.newExpression(j.identifier('AggregateError'), node.arguments),
			);

			return root.toSource(options);
		},
	};
}
