import { ts } from '@ast-grep/napi';
import { replaceDefaultImport } from '../shared-ast-grep.js';

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
		name: 'md5',
		to: 'native',
		transform: ({ file }) => {
			const ast = ts.parse(file.source);
			const root = ast.root();

			const { edits, localNames, quoteType } = replaceDefaultImport(
				root,
				'md5',
				'crypto',
				'crypto',
			);

			if (localNames.length === 0) {
				return file.source;
			}

			for (const localName of localNames) {
				for (const usage of root.findAll({
					rule: { pattern: `${localName}($ARG)` },
				})) {
					const arg = usage.getMatch('ARG');
					if (arg === null) continue;
					edits.push(
						usage.replace(
							`crypto.createHash(${quoteType}md5${quoteType}).update(${arg.text()}).digest(${quoteType}hex${quoteType})`,
						),
					);
				}
			}

			return root.commitEdits(edits);
		},
	};
}
