import jscodeshift from 'jscodeshift';

/**
 * @typedef {import('../../types.js').Codemod} Codemod
 * @typedef {import('../../types.js').CodemodOptions} CodemodOptions
 */

import { DEFAULT_IMPORT, getImportIdentifierMap, getVariableExpressionHasIdentifier, removeImport, replaceDefaultImport, replaceRequireMemberExpression } from '../shared.js';

/**
 * @param {CodemodOptions} [options]
 * @returns {Codemod}
 */
export default function (options) {
  return {
    name: 'define-properties',
    transform: ({ file }) => {
      const j = jscodeshift;
      const root = j(file.source);
      const variableExpressionHasIdentifier = getVariableExpressionHasIdentifier('define-properties', 'supportsDescriptors', root, j);

      // Use case 1: require('define-properties').supportsDescriptors
      if (variableExpressionHasIdentifier) {
        const didReplace = replaceRequireMemberExpression('define-properties', true, root, j);
        return didReplace ? root.toSource(options) : file.source;
      }

      const map = getImportIdentifierMap('define-properties', root, j);

      const identifier = map[DEFAULT_IMPORT];

      const callExpressions = root.find(j.CallExpression, {
        callee: {
          name: identifier
        }
      })

      
      if (!callExpressions.length) {
        removeImport('define-properties', root, j);
        return root.toSource(options);
      }
      
      let transformCount = 0;

      callExpressions.forEach((path) => {
        const node = path.node;
        // Use case 2: define(object, map);
        if (node.arguments.length === 2) {
          // in here, create a new function once for defineProperties, and then swap all instance over to use it.
        }

        // Use case 3: define(object, map, predicates);
        if (node.arguments.length === 3) {
          // in here, create a comment before the define call, and leave it alone
        }
      })

      return file.source;
    },
  }
};
