import { ts } from '@ast-grep/napi';
import { findNamedDefaultImport } from '../shared-ast-grep.js';

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
		name: 'invariant',
		to: 'tiny-invariant',
		transform: ({ file }) => {
			const ast = ts.parse(file.source);
			const root = ast.root();
			const edits = [];

			const imports = findNamedDefaultImport(root, 'invariant');

			for (const imp of imports) {
				const nameMatch = imp.getMatch('NAME');
				if (nameMatch) {
					const name = nameMatch.text();
					const source = imp.text();
					const quoteType = source.includes('"') ? '"' : "'";

					if (imp.text().startsWith('import')) {
						edits.push(
							imp.replace(
								`import ${name} from ${quoteType}tiny-invariant${quoteType};`,
							),
						);
					} else {
						edits.push(
							imp.replace(
								`const ${name} = require(${quoteType}tiny-invariant${quoteType});`,
							),
						);
					}
				}
			}

			return root.commitEdits(edits);
		},
	};
}
