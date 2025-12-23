import jscodeshift from 'jscodeshift';
import { removeImport } from '../shared.js';

/**
 * @typedef {import('../../types.js').Codemod} Codemod
 * @typedef {import('../../types.js').CodemodOptions} CodemodOptions
 */

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
 * @param {CodemodOptions} [options]
 * @returns {Codemod}
 */
export default function (options) {
	return {
		name: 'es-errors',
		to: 'native',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);
			let dirtyFlag = false;

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
