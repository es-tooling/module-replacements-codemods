import { ts } from '@ast-grep/napi';
import { removeImport } from '../shared-ast-grep.js';

const MODULE_NAME = 'es-set-tostringtag';

/**
 * @param {string} tagText
 * @returns {string}
 */
function defineDescriptor(tagText) {
	return `{\n  configurable: true,\n  enumerable: false,\n  value: ${tagText},\n  writable: false\n}`;
}

/**
 * @param {string} objText
 * @param {string} tagText
 * @returns {string}
 */
function defineProperty(objText, tagText) {
	return `Object.defineProperty(${objText}, Symbol.toStringTag, ${defineDescriptor(tagText)})`;
}

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
			const ast = ts.parse(file.source);
			const root = ast.root();

			const { edits, localNames } = removeImport(root, MODULE_NAME);
			const identifierName = localNames[0];

			if (!identifierName) {
				return edits.length > 0 ? root.commitEdits(edits) : file.source;
			}

			// With force: true - always define property
			const forceCalls = root.findAll({
				rule: {
					pattern: `${identifierName}($OBJ, $TAG, {force: true})`,
				},
			});

			for (const call of forceCalls) {
				const obj = call.getMatch('OBJ');
				const tag = call.getMatch('TAG');
				if (!obj || !tag) continue;
				edits.push(call.replace(defineProperty(obj.text(), tag.text())));
			}

			// Without force or without options arg - conditional define property
			const regularCalls = root.findAll({
				rule: {
					pattern: `${identifierName}($OBJ, $TAG)`,
				},
			});

			for (const call of regularCalls) {
				const obj = call.getMatch('OBJ');
				const tag = call.getMatch('TAG');
				if (!obj || !tag) continue;
				edits.push(
					call.replace(
						`!Object.hasOwn(${obj.text()}, Symbol.toStringTag) && ${defineProperty(obj.text(), tag.text())}`,
					),
				);
			}

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
