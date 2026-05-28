import { ts } from '@ast-grep/napi';
import {
	computePolyfillMethodCallReplacementEdits,
	removeImport,
} from '../shared-ast-grep.js';

const MODULE_NAME = 'es-string-html-methods';

/**
 * @typedef {import('../../types.js').Codemod} Codemod
 * @typedef {import('../../types.js').CodemodOptions} CodemodOptions
 */

const methods = [
	'anchor',
	'big',
	'blink',
	'bold',
	'fixed',
	'fontcolor',
	'fontsize',
	'italics',
	'link',
	'small',
	'strike',
	'sub',
	'sup',
];

/**
 * @param {CodemodOptions} [options]
 * @returns {Codemod}
 */
export default function (options) {
	return {
		name: MODULE_NAME,
		to: 'native',
		transform: ({ file }) => {
			const ast = ts.parse(file.source);
			const root = ast.root();
			const edits = [];

			/** @type {Record<string,string>} */
			const methodIdentifiers = {};

			for (const method of methods) {
				const { edits: removeEdits, localNames } = removeImport(
					root,
					`${MODULE_NAME}/${method}`,
				);
				edits.push(...removeEdits);
				if (localNames[0]) {
					methodIdentifiers[method] = localNames[0];
				}
			}

			for (const method of methods) {
				const { edits: removeAutoEdits } = removeImport(
					root,
					`${MODULE_NAME}/${method}/auto`,
				);
				edits.push(...removeAutoEdits);
			}

			const { edits: removeGlobalAutoEdits } = removeImport(
				root,
				`${MODULE_NAME}/auto`,
			);
			edits.push(...removeGlobalAutoEdits);

			for (const [method, identifierName] of Object.entries(
				methodIdentifiers,
			)) {
				const methodEdits = computePolyfillMethodCallReplacementEdits(
					root,
					identifierName,
					method,
					(args) => args.length > 0 && args[0].kind() !== 'spread_element',
				);
				edits.push(...methodEdits);
			}

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
