import jscodeshift from 'jscodeshift';
import { removeImport } from '../shared.js';

/**
 * @typedef {import('../../types.js').Codemod} Codemod
 * @typedef {import('../../types.js').CodemodOptions} CodemodOptions
 */

/**
 * @param {CodemodOptions} [options]
 * @returns {Codemod}
 */
export default function(options) {
  return {
    name: 'object.keys',
    transform: ({ file }) => {
      const j = jscodeshift;
			const root = j(file.source);

      removeImport('object.keys', root, j);

			return root.toSource(options);
    },
  }
};
