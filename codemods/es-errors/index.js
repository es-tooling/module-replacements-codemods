import jscodeshift from 'jscodeshift';
import { removeImport } from '../shared.js';

/** @import { Codemod } from '../../types.js' **/

const moduleToErrorMap = {
	'es-errors': 'Error',
	'es-errors/eval': 'EvalError',
	'es-errors/range': 'RangeError',
	'es-errors/ref': 'ReferenceError',
	'es-errors/syntax': 'SyntaxError',
	'es-errors/type': 'TypeError',
	'es-errors/uri': 'URIError',
};

/**
 * @returns {Codemod}
 */
export default function () {
	return {
		name: 'es-errors',
		to: 'native',
		transform: ({ file, options }) => {
			const j = jscodeshift;
			const root = j(file.source);

			for (const [moduleName, errorName] of Object.entries(moduleToErrorMap)) {
				const { identifier } = removeImport(moduleName, root, j);

				root
					.find(j.NewExpression, {
						callee: {
							type: 'Identifier',
							name: identifier,
						},
					})
					.replaceWith(({ node }) => {
						return j.newExpression(j.identifier(errorName), node.arguments);
					});
			}

			return root.toSource(options);
		},
	};
}
