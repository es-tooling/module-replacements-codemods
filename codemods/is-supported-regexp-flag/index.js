import { Lang, parse } from '@ast-grep/napi';
import { findDefaultImportIdentifier } from '../shared-ast-grep.js';

const MODULE_NAME = 'is-supported-regexp-flag';

/**
 * @param {string} name
 * @returns {string}
 */
const isSupportedRegexpFlagTemplate = (name) =>
	`const ${name} = (flag) => {
  try {
    RegExp("", flag);
    return true;
  } catch {
    return false;
  }
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
				imp.replace(
					i === 0 && hasUsage
						? isSupportedRegexpFlagTemplate(identifierName)
						: '',
				),
			);

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
