import { ts } from '@ast-grep/napi';
import { removeImport } from '../shared-ast-grep.js';

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
		name: 'is-number-object',
		to: 'native',
		transform: ({ file }) => {
			const ast = ts.parse(file.source);
			const root = ast.root();

			const { edits, localNames } = removeImport(root, 'is-number-object');

			for (const name of localNames) {
				const calls = root.findAll({
					rule: { pattern: `${name}($ARG)` },
				});
				for (const call of calls) {
					const arg = call.getMatch('ARG');
					if (arg) {
						edits.push(
							call.replace(
								`Object.prototype.toString.call(${arg.text()}) === '[object Number]'`,
							),
						);
					}
				}
			}

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
