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
    name: 'array.prototype.reduceright',
    transform: ({ file }) => {
      const j = jscodeshift;
      const root = j(file.source);
      let dirtyFlag = false;

      const { identifier } = removeImport('array.prototype.reduceright', root, j);

      root.find(j.CallExpression, {
          callee: {
              type: 'Identifier',
              name: identifier,
          },
      }).forEach((path) => {
          const args = path.value.arguments;
          if (args.length > 1) {
              const [array, ...fnArguments] = args;

              const newExpression = j.callExpression(
                  //@ts-ignore
                  j.memberExpression(array, j.identifier('reduceRight')),
                  [...fnArguments],
              );
              j(path).replaceWith(newExpression);
              dirtyFlag = true;
          }
      });

      return dirtyFlag ? root.toSource(options) : file.source;
    },
  }
};
