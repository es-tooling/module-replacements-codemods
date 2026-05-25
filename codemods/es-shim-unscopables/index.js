import { ts } from '@ast-grep/napi';
import { removeImport } from '../shared-ast-grep.js';

const MODULE_NAME = 'es-shim-unscopables';

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
			const identifierName = localNames[0];

			if (!identifierName) {
				return edits.length > 0 ? root.commitEdits(edits) : file.source;
			}

			const calls = root.findAll({
				rule: { pattern: `${identifierName}($$$ARGS)` },
			});

			for (const call of calls) {
				const parent = call.parent();
				const target =
					parent?.kind() === 'expression_statement' ? parent : call;
				edits.push(target.replace(''));
			}

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
