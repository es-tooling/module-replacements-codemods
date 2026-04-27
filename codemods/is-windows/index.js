import { ts } from '@ast-grep/napi';
import { findDefaultImportIdentifier } from '../shared-ast-grep.js';

const MODULE_NAME = 'is-windows';

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

			const negatedCallExpressions = root.findAll({
				rule: {
					pattern: `!${identifierName}()`,
				},
			});

			for (const call of negatedCallExpressions) {
				edits.push(call.replace("process.platform !== 'win32'"));
			}

			const callExpressions = root.findAll({
				rule: {
					pattern: `${identifierName}()`,
				},
			});

			for (const call of callExpressions) {
				edits.push(call.replace("process.platform === 'win32'"));
			}

			for (const imp of imports) {
				edits.push(imp.replace(''));
			}

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
