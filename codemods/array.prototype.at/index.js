import jscodeshift from "jscodeshift";
import { removeImport } from "../shared.js";

/**
 * @typedef {import('../../types.js').Codemod} Codemod
 * @typedef {import('../../types.js').CodemodOptions} CodemodOptions
 */

/**
 * @NOTE
 * `array.prototype.at` supports passing a callback, e.g.:
 * `var results = at(arr, (x, i) => x);`
 * 
 * We don't support that for now, but the most common usage seems to be similar
 * to the native usage
 * 
 * @param {CodemodOptions} [options]
 * @returns {Codemod}
 */
export default function (options) {
  return {
    name: "array.prototype.at",
    transform: ({ file }) => {
      const j = jscodeshift;
      const root = j(file.source);
      let dirtyFlag = false;

      const { identifier } = removeImport("array.prototype.at", root, j);

      root
        .find(j.CallExpression, {
          callee: {
            type: "Identifier",
            name: identifier,
          },
        })
        .forEach((path) => {
          const [arrayArg, indexArg] = path.node.arguments;
          if (
            j.Identifier.check(arrayArg) ||
            j.ArrayExpression.check(arrayArg)
          ) {
            path.replace(
              j.callExpression(
                j.memberExpression(arrayArg, j.identifier("at")),
                [indexArg]
              )
            );
            dirtyFlag = true;
          }
        });

      return dirtyFlag ? root.toSource(options) : file.source;
    },
  };
}
