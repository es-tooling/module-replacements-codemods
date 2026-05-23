import { ts } from '@ast-grep/napi';
import { replacePolyfillUsage } from '../shared-ast-grep.js';

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
			const ast = ts.parse(file.source);
			const root = ast.root();
			const edits = [];

			for (const [moduleName, errorName] of Object.entries(moduleToErrorMap)) {
				const { edits: moduleEdits } = replacePolyfillUsage(
					root,
					moduleName,
					errorName,
				);
				edits.push(...moduleEdits);
			}

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
