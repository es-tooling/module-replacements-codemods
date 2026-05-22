/**
 * @import { Codemod, CodemodOptions } from "../../types.js"
 */

import { ts } from '@ast-grep/napi';
import { removeImport } from '../shared-ast-grep.js';

const IS_PRIMITIVE_FN = `function isPrimitive(val) {
\tif (typeof val === 'object') {
\t\treturn val === null;
\t}
\treturn typeof val !== 'function';
}`;

/**
 * @param {CodemodOptions} [options]
 * @returns {Codemod}
 */
export default function (options) {
	return {
		name: 'is-primitive',
		to: 'native',
		transform: ({ file }) => {
			const ast = ts.parse(file.source);
			const root = ast.root();

			const { edits, localNames } = removeImport(root, 'is-primitive');

			if (localNames.length > 0) {
				const body = root.children();
				if (body.length > 0) {
					edits.push(
						body[body.length - 1].replace(
							`${body[body.length - 1].text()}\n\n${IS_PRIMITIVE_FN}`,
						),
					);
				} else {
					edits.push(root.replace(IS_PRIMITIVE_FN));
				}
			}

			return edits.length > 0 ? root.commitEdits(edits) : file.source;
		},
	};
}
