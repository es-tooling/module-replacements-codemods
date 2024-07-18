/**
 * type definition for return type object
 * @typedef {Object} RemoveImport
 * @property {string} identifier - the name of the module as it was imported or required. for example, `keys` in `import keys from 'object-keys'`
 */

/**
 * @param {string} name - package name to remove import/require calls for
 * @param {import("jscodeshift").Collection} root - package name to remove import/require calls for
 * @param {import("jscodeshift").JSCodeshift} j - jscodeshift instance
 * @returns {RemoveImport}
 */
export function removeImport(name, root, j) {
  // Find the import or require statement for 'is-boolean-object'
  const importDeclaration = root.find(j.ImportDeclaration, {
    source: {
      value: name,
    },
  });

  const requireDeclaration = root.find(j.VariableDeclarator, {
    init: {
      callee: {
        name: "require",
      },
      arguments: [
        {
          value: name,
        },
      ],
    },
  });

  // Return the identifier name, e.g. 'fn' in `import { fn } from 'is-boolean-object'`
  // or `var fn = require('is-boolean-object')`
  const identifier =
    importDeclaration.paths().length > 0
      ? importDeclaration.get().node.specifiers[0].local.name
      : requireDeclaration.find(j.Identifier).get().node.name;

  importDeclaration.remove();
  requireDeclaration.remove();

  return { identifier };
}
