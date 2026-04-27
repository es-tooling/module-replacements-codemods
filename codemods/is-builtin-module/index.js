import { ts } from '@ast-grep/napi';
import { findDefaultImportIdentifier } from '../shared-ast-grep.js';

const MODULE_NAME = 'is-builtin-module';

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

			// Replace import/require statements
			for (const imp of imports) {
				const impText = imp.text();
				const quoteType = impText.includes('"') ? '"' : "'";

				if (impText.startsWith('import')) {
					edits.push(
						imp.replace(
							`import { isBuiltin } from ${quoteType}node:module${quoteType};`,
						),
					);
				} else {
					edits.push(
						imp.replace(
							`const { isBuiltin } = require(${quoteType}node:module${quoteType});`,
						),
					);
				}
			}

			// Replace function calls
			const calls = root.findAll({
				rule: {
					pattern: `${identifierName}($$$ARGS)`,
				},
			});

			for (const call of calls) {
				edits.push(
					call.replace(call.text().replace(identifierName, 'isBuiltin')),
				);
			}

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
