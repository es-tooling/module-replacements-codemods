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
    name: "array-includes",
    transform: ({ file }) => {
      const j = jscodeshift;
      const root = j(file.source);
      let dirtyFlag = false;

      removeImport("array-includes", root, j);

      root
        .find(j.CallExpression, {
          callee: {
            type: "Identifier",
            name: "includes",
          },
        })
        .forEach((path) => {
          const args = path.value.arguments;
          if (args.length === 2 || args.length === 3) {
            const [array, ...otherArgs] = args;

            const newExpression = j.callExpression(
              //@ts-ignore
              j.memberExpression(array, j.identifier("includes")),
              otherArgs,
            );
            j(path).replaceWith(newExpression);
            dirtyFlag = true;
          }
        });

      return dirtyFlag ? root.toSource(options) : file.source;
    },
  };
}
