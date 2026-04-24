import { ts } from '@ast-grep/napi';
import { findDefaultImportIdentifier } from '../shared-ast-grep.js';

const MODULE_NAME = 'array.prototype.every';

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
		name: MODULE_NAME,
		to: 'native',
		transform: ({ file }) => {
			const ast = ts.parse(file.source);
			const root = ast.root();
			const edits = [];

			const { imports, identifierName } = findDefaultImportIdentifier(
				root,
				MODULE_NAME,
			);

			if (!identifierName) {
				return file.source;
			}

			const callExpressions = root.findAll({
				rule: {
					pattern: `${identifierName}($$ARRAY, $$CALLBACK)`,
				},
			});

			for (const call of callExpressions) {
				const arrayMatch = call.getMatch('ARRAY');
				if (!arrayMatch) continue;
				const callbackMatch = call.getMatch('CALLBACK');
				if (!callbackMatch) continue;

				const arrayText = arrayMatch.text();
				const callbackText = callbackMatch.text();

				edits.push(call.replace(`${arrayText}.every(${callbackText})`));
			}

			for (const imp of imports) {
				edits.push(imp.replace(''));
			}

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
