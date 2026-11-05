import { Lang, parse } from '@ast-grep/napi';
import { findDefaultImportIdentifier } from '../shared-ast-grep.js';

const MODULE_NAME = 'is-jpg';

/**
 * @param {string} name
 * @returns {string}
 */
const isJpgTemplate = (name) =>
	`function ${name}(buf) {
  if (!buf || buf.length < 3) return false;
  return buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
}`;

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
			const ast = parse(Lang.TypeScript, file.source);
			const root = ast.root();

			const { imports, identifierName } = findDefaultImportIdentifier(
				root,
				MODULE_NAME,
			);

			if (!identifierName) {
				return file.source;
			}

			const edits = [];

			for (const imp of imports) {
				edits.push(imp.replace(isJpgTemplate(identifierName)));
			}

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
