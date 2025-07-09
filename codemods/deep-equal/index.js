import jscodeshift from 'jscodeshift';
import { replaceImport } from '../replaceImport.js';

/** @import { Codemod, CodemodOptions } from '../../types.js' **/

/**
 * @returns {Codemod}
 */
export default function () {
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
