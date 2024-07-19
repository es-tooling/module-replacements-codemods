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
export default function (options) {
  return {
    name: "array.prototype.entries",
    transform: ({ file }) => {
      const j = jscodeshift;
      const root = j(file.source);
      let dirtyFlag = false;

      const { identifier } = removeImport("array.prototype.entries", root, j);

      root
        .find(j.CallExpression, {
          callee: { name: identifier },
        })
        .forEach((path) => {
          const { arguments: args } = path.node;

          // Ensure the call expression has exactly one argument
          if (args.length === 1) {
            const arg = args[0];

            // Check if the argument is an array expression or an identifier
            if (j.ArrayExpression.check(arg) || j.Identifier.check(arg)) {
              // Replace the call expression with a method call on the argument
              j(path).replaceWith(
                j.callExpression(
                  j.memberExpression(arg, j.identifier(identifier)),
                  []
                )
              );
              dirtyFlag = true;
            }
          }
        });

      return dirtyFlag ? root.toSource(options) : file.source;
    },
  };
}
