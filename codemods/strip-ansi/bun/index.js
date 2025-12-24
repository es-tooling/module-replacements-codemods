import { ts } from '@ast-grep/napi';
import { findNamedDefaultImport } from '../../shared-ast-grep.js';

/**
 * @typedef {import('../../../types.js').Codemod} Codemod
 * @typedef {import('../../../types.js').CodemodOptions} CodemodOptions
 */

/**
 * @param {CodemodOptions} [options]
 * @returns {Codemod}
 */
export default function (options) {
	return {
		name: 'strip-ansi-bun',
		to: 'native',
		transform: ({ file }) => {
			const ast = ts.parse(file.source);
			const root = ast.root();
			const edits = [];
			const importNames = new Set();

			const imports = findNamedDefaultImport(root, 'strip-ansi');

			for (const imp of imports) {
				const nameMatch = imp.getMatch('NAME');
				if (nameMatch) {
					const name = nameMatch.text();
					const source = imp.text();
					const quoteType = source.includes('"') ? '"' : "'";

					importNames.add(name);

					if (imp.text().startsWith('import')) {
						edits.push(
							imp.replace(
								`import { stripANSI } from ${quoteType}bun${quoteType};`,
							),
						);
					} else {
						edits.push(
							imp.replace(
								`const { stripANSI } = require(${quoteType}bun${quoteType});`,
							),
						);
					}
				}
			}

			for (const importName of importNames) {
				const functionCalls = root.findAll({
					rule: {
						pattern: {
							context: `${importName}($VALUE)`,
							strictness: 'relaxed',
						},
					},
				});

				for (const call of functionCalls) {
					const valueMatch = call.getMatch('VALUE');
					if (valueMatch) {
						edits.push(call.replace(`stripANSI(${valueMatch.text()})`));
					}
				}
			}

			return root.commitEdits(edits);
		},
	};
}
