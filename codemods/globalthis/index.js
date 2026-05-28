import { ts } from '@ast-grep/napi';
import { replacePolyfillUsage } from '../shared-ast-grep.js';

const MODULE_NAME = 'globalthis';
const TARGET = 'globalThis';

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
			const { edits: edits1 } = replacePolyfillUsage(root, MODULE_NAME, TARGET);
			const { edits: edits2 } = replacePolyfillUsage(
				root,
				`${MODULE_NAME}/polyfill`,
				TARGET,
			);
			const { edits: edits3 } = replacePolyfillUsage(
				root,
				`${MODULE_NAME}/shim`,
				TARGET,
			);
			return root.commitEdits([...edits1, ...edits2, ...edits3]);
		},
	};
}
