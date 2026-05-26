import { ts } from '@ast-grep/napi';
import { replacePolyfillUsage } from '../shared-ast-grep.js';

const MODULE_NAME = 'gopd';
const REPLACEMENT = 'Object.getOwnPropertyDescriptor';

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
			const { edits } = replacePolyfillUsage(root, MODULE_NAME, REPLACEMENT);
			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
