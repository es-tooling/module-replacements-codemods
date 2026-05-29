import { ts } from '@ast-grep/napi';
import { findDefaultImportIdentifier } from '../shared-ast-grep.js';

const MODULE_NAME = 'define-properties';

/**
 * @param {string} name
 * @returns {string}
 */
const definePropertiesTemplate = (name) =>
	`const ${name} = function (object, map) {
  let propKeys = Object.keys(map);
  propKeys = propKeys.concat(Object.getOwnPropertySymbols(map));

  for (var i = 0; i < propKeys.length; i += 1) {
    const propKey = propKeys[i];
    const value = map[propKey];

    if (propKey in object) {
      continue;
    }

    Object.defineProperty(object, propKey, {
      value,
      configurable: true,
      enumerable: false,
      writable: true,
    })
  }

  return object;
};`;

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
		name: MODULE_NAME,
		to: 'native',
		transform: ({ file }) => {
			const root = ts.parse(file.source).root();
			const edits = [];

			const memberExprs = root.findAll({
				rule: {
					pattern: {
						context: "require('define-properties').supportsDescriptors",
						strictness: 'relaxed',
					},
				},
			});

			if (memberExprs.length > 0) {
				for (const expr of memberExprs) edits.push(expr.replace('true'));
				return root.commitEdits(edits);
			}

			const { imports, identifierName } = findDefaultImportIdentifier(
				root,
				MODULE_NAME,
			);
			if (!identifierName) return file.source;

			const calls = root.findAll({
				rule: { pattern: `${identifierName}($$$ARGS)` },
			});

			if (calls.length === 0) {
				for (const imp of imports) edits.push(imp.replace(''));
				return root.commitEdits(edits);
			}

			let transformCount = 0;

			for (const call of calls) {
				const args = (call.getMultipleMatches('ARGS') || []).filter(
					(m) => m.kind() !== ',',
				);

				if (args.length === 2) {
					const fn = call.field('function');
					if (fn) edits.push(fn.replace(`$${identifierName}`));
					transformCount++;
				}

				if (args.length === 3) {
					let stmt = call;
					while (stmt) {
						const parent = stmt.parent();
						if (!parent) break;
						const k = parent.kind();
						if (
							k === 'expression_statement' ||
							k === 'lexical_declaration' ||
							k === 'variable_declaration'
						) {
							stmt = parent;
							break;
						}
						stmt = parent;
					}
					const comment =
						'/*\n This usage of `define-properties` usage can be cleaned up through a mix of Object.defineProperty() and a custom predicate function.\n details can be found here: https://github.com/es-tooling/module-replacements-codemods/issues/66 \n*/';
					edits.push(stmt.replace(`${comment}\n${stmt.text()}`));
				}
			}

			if (transformCount === 0) {
				return edits.length > 0 ? root.commitEdits(edits) : file.source;
			}

			const newName = `$${identifierName}`;
			const polyfill = definePropertiesTemplate(newName);
			const allTransformed = transformCount === calls.length;

			if (allTransformed) {
				for (const imp of imports) edits.push(imp.replace(polyfill));
			} else {
				for (const imp of imports)
					edits.push(imp.replace(`${imp.text()}\n\n${polyfill}`));
			}

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
