import jscodeshift from 'jscodeshift';
import {
	DEFAULT_IMPORT,
	getImportIdentifierMap,
	getVariableExpressionHasIdentifier,
	insertAfterImports,
	insertCommentAboveNode,
	removeImport,
	replaceRequireMemberExpression,
} from '../shared.js';

/** @import { Codemod } from '../../types.js' **/

/**
 *
 * @param {string} name
 * @returns
 */
const definePropertiesTemplate = (name) => `
const ${name} = function (object, map) {
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
 * @returns {Codemod}
 */
export default function () {
	return {
		name: 'define-properties',
		to: 'native',
		transform: ({ file, options }) => {
			const j = jscodeshift;
			const root = j(file.source);
			const variableExpressionHasIdentifier =
				getVariableExpressionHasIdentifier(
					'define-properties',
					'supportsDescriptors',
					root,
					j,
				);

			// Use case 1: require('define-properties').supportsDescriptors
			if (variableExpressionHasIdentifier) {
				const didReplace = replaceRequireMemberExpression(
					'define-properties',
					true,
					root,
					j,
				);
				return didReplace ? root.toSource(options) : file.source;
			}

			const map = getImportIdentifierMap('define-properties', root, j);

			const identifier = map[DEFAULT_IMPORT];

			const callExpressions = root.find(j.CallExpression, {
				callee: {
					name: identifier,
				},
			});

			if (!callExpressions.length) {
				removeImport('define-properties', root, j);
				return root.toSource(options);
			}

			let transformCount = 0;
			let dirty = false;

			callExpressions.forEach((path) => {
				const node = path.node;
				const newIdentifier = `$${identifier}`;

				// Use case 2: define(object, map);
				if (node.arguments.length === 2) {
					if (transformCount === 0) {
						const defineFunction = definePropertiesTemplate(newIdentifier);
						insertAfterImports(defineFunction, root, j);
					}

					// Not all call expressions have a name property, but node.callee should be of type Identifi
					if ('name' in node.callee) {
						node.callee.name = newIdentifier;
					}

					transformCount++;
					dirty = true;
				}

				// Use case 3: define(object, map, predicates);
				if (node.arguments.length === 3) {
					const comment = j.commentBlock(
						'\n This usage of `define-properties` usage can be cleaned up through a mix of Object.defineProperty() and a custom predicate function.\n details can be found here: https://github.com/es-tooling/module-replacements-codemods/issues/66 \n',
						true,
						false,
					);

					const startLine = node.loc?.start.line ?? 0;

					insertCommentAboveNode(comment, startLine, root, j);

					dirty = true;
				}
			});

			if (transformCount === callExpressions.length) {
				removeImport('define-properties', root, j);
			}

			return dirty ? root.toSource(options) : file.source;
		},
	};
}
