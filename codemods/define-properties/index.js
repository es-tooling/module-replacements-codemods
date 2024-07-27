import jscodeshift from 'jscodeshift';

/**
 * @typedef {import('../../types.js').Codemod} Codemod
 * @typedef {import('../../types.js').CodemodOptions} CodemodOptions
 */

import { getVariableExpressionHasIdentifier, removeImport, replaceDefaultImport, replaceRequireMemberExpression } from '../shared.js';

/**
 * @param {CodemodOptions} [options]
 * @returns {Codemod}
 */
export default function (options) {
  return {
    name: 'define-properties',
    transform: ({ file }) => {
      let dirty = false;
      const j = jscodeshift;
      const root = j(file.source);
      const variableExpressionHasIdentifier = getVariableExpressionHasIdentifier('define-properties', 'supportsDescriptors', root, j);

      // Use case 1: require('define-properties').supportsDescriptors
      if (variableExpressionHasIdentifier) {
        const didReplace = replaceRequireMemberExpression('define-properties', true, root, j);
        dirty = didReplace;
      }


      const cause = root.toSource(options);
      return dirty ? root.toSource(options) : file.source;
    },
  }
};
