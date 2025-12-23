import jscodeshift from 'jscodeshift';
import { replaceImport } from '../replaceImport.js';

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
		name: 'deep-equal',
		to: 'dequal',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);
			const didReplacement = replaceImport(
				j,
				root,
				{ moduleName: 'deep-equal', importName: 'default', cjsNamespace: true },
				{ moduleName: 'dequal', importName: 'dequal', cjsNamespace: false },
			);

			return didReplacement ? root.toSource() : file.source;
		},
	};
}
