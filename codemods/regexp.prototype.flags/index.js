import { ts } from '@ast-grep/napi';
import {
	computePolyfillPropertyReplacementEdits,
	removeImport,
} from '../shared-ast-grep.js';

const MODULE_NAME = 'regexp.prototype.flags';
const PROPERTY_NAME = 'flags';

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
				const shimCalls = root.findAll({
					rule: {
						kind: 'expression_statement',
						has: { pattern: `${name}.shim()` },
					},
				});
				for (const call of shimCalls) {
					edits.push(call.replace(''));
				}

				const propEdits = computePolyfillPropertyReplacementEdits(
					root,
					name,
					PROPERTY_NAME,
				);
				edits.push(...propEdits);
			}

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
