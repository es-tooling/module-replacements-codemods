import jscodeshift from 'jscodeshift';
import { removeImport } from '../shared.js';

/** @import { Codemod } from '../../types.js' **/

/**
 * @returns {Codemod}
 */
export default function () {
	return {
		name: 'es-aggregate-error',
		to: 'native',
		transform: ({ file, options }) => {
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
