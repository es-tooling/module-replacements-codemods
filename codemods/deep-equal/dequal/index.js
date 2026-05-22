import { ts } from '@ast-grep/napi';
import { replaceDefaultWithNamedImport } from '../../shared-ast-grep.js';

const MODULE_NAME = 'deep-equal';
const TARGET = 'dequal';

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
		name: MODULE_NAME,
		to: TARGET,
		transform: ({ file }) => {
			const ast = ts.parse(file.source);
			const root = ast.root();

			const { edits, localNames } = replaceDefaultWithNamedImport(
				root,
				MODULE_NAME,
				TARGET,
				TARGET,
			);

			if (localNames.length === 0) {
				return file.source;
			}

			for (const name of localNames) {
				const usages = root.findAll({
					rule: { kind: 'identifier', pattern: name },
				});
				for (const usage of usages) {
					edits.push(usage.replace(TARGET));
				}
			}

			return root.commitEdits(edits);
		},
	};
}
