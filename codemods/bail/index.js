import { Lang, parse } from '@ast-grep/napi';
import { removeImport } from '../shared-ast-grep.js';

/** @import { Codemod, CodemodOptions } from '../../types.js' */

const MODULE_NAME = 'bail';

/**
 * @param {CodemodOptions} [options]
 * @returns {Codemod}
 */
export default function (options) {
	return {
		name: MODULE_NAME,
		to: 'native',
		transform({ file }) {
			const ast = parse(Lang.TypeScript, file.source);
			const root = ast.root();

			const { edits, localNames } = removeImport(root, MODULE_NAME);
			if (localNames.length === 0) {
				return file.source;
			}

			for (const localName of localNames) {
				const calls = root.findAll({
					rule: {
						pattern: `${localName}($ERR)`,
					},
				});

				for (const call of calls) {
					const err = call.getMatch('ERR')?.text();
					if (!err) continue;

					const parent = call.parent();
					const target =
						parent?.kind() === 'expression_statement' ? parent : call;

					edits.push(target.replace(`if (${err}) {\n  throw ${err};\n}`));
				}
			}

			return root.commitEdits(edits);
		},
	};
}
