import { Lang, parse } from '@ast-grep/napi';
import { findDefaultImportIdentifier } from '../shared-ast-grep.js';

const MODULE_NAME = 'is-png';

/**
 * @param {string} name
 * @returns {string}
 */
const isPngTemplate = (name) =>
	`function ${name}(buf) {
  if (!buf || buf.length < 8) return false;
  return buf[0] === 0x89 && buf[1] === 0x50
    && buf[2] === 0x4e && buf[3] === 0x47
    && buf[4] === 0x0d && buf[5] === 0x0a
    && buf[6] === 0x1a && buf[7] === 0x0a;
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

			const hasUsage =
				root.findAll({ rule: { kind: 'identifier', pattern: identifierName } })
					.length > imports.length;

			const edits = imports.map((imp, i) =>
				imp.replace(i === 0 && hasUsage ? isPngTemplate(identifierName) : ''),
			);

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
