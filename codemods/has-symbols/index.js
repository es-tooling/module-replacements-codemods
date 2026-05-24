import { ts } from '@ast-grep/napi';
import { removeImport } from '../shared-ast-grep.js';

const MODULE_NAME = 'has-symbols';

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
			const shams = removeImport(root, `${MODULE_NAME}/shams`);
			edits.push(...shams.edits);
			const allNames = [...localNames, ...shams.localNames];

			for (const name of allNames) {
				const calls = root.findAll({
					rule: {
						pattern: `${name}($$$ARGS)`,
					},
				});
				for (const call of calls) {
					edits.push(call.replace('true'));
				}
			}

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
