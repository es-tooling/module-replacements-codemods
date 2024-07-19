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
    name: "is-travis",
    transform: ({ file }) => {
      const j = jscodeshift;
      const root = j(file.source);
      let dirtyFlag = false;

      const { identifier } = removeImport("is-travis", root, j);
      root.find(j.Identifier, { name: identifier }).replaceWith(() => {
        dirtyFlag = true;
        return j.parenthesizedExpression(j.binaryExpression(
          "in",
          j.literal("TRAVIS"),
          j.memberExpression(j.identifier("process"), j.identifier("env"))
        ));
      });

      return dirtyFlag ? root.toSource({ quote: "single" }) : file.source;
    },
  };
}
