import { ts } from '@ast-grep/napi';
import { removeImport } from '../shared-ast-grep.js';

const MODULE_NAME = 'string.raw';

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

			for (const name of localNames) {
				const taggedTemplates = root.findAll({
					rule: {
						kind: 'call_expression',
						has: { kind: 'template_string' },
					},
				});

				for (const tt of taggedTemplates) {
					const children = tt.children();
					if (children.length >= 2) {
						const tag = children[0];
						const template = children[1];
						if (tag.kind() === 'identifier' && tag.text() === name) {
							edits.push(tt.replace(`String.raw${template.text()}`));
						}
					}
				}
			}

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
