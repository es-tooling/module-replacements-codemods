import { ts } from '@ast-grep/napi';
import { removeImport } from '../shared-ast-grep.js';

const MODULE_NAME = 'is-travis';

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
			const { edits, localNames } = removeImport(root, MODULE_NAME);

			if (localNames.length === 0) {
				return file.source;
			}

			for (const localName of localNames) {
				const ids = root.findAll({
					rule: {
						kind: 'identifier',
						pattern: localName,
					},
				});

				for (const id of ids) {
					edits.push(id.replace("('TRAVIS' in process.env)"));
				}
			}

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
