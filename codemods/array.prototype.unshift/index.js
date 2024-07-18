
import jscodeshift from "jscodeshift";
import { removeImport } from "../shared.js";

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
    name: 'array.prototype.unshift',
    transform: ({ file }) => {
      const j = jscodeshift;
      const root = j(file.source);
      let dirtyFlag = false;

      removeImport('array.prototype.unshift', root, j);

      root.find(j.CallExpression, {
          callee: {
              type: 'Identifier',
              name: 'unshift',
          },
      }).forEach((path) => {
          const args = path.value.arguments;
          if (args.length > 1) {
              const [array, ...elements] = args;

              const newExpression = j.callExpression(
                  //@ts-ignore
                  j.memberExpression(array, j.identifier('unshift')),
                  [...elements],
              );
              j(path).replaceWith(newExpression);
              dirtyFlag = true;
          }
      });

      return dirtyFlag ? root.toSource(options) : file.source;
    },
  }
};
