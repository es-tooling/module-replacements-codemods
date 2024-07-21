import jscodeshift from 'jscodeshift';
import { removeImport } from '../shared.js';

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
		name: 'date',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);
			let dirtyFlag = false;

			removeImport('date/auto', root, j);
			const { identifier } = removeImport('date', root, j);

			root
				.find(j.Identifier, {
					name: identifier,
				})
				.forEach((path) => {
					path.node.name = 'Date';
					dirtyFlag = true;
				});

			return dirtyFlag ? root.toSource(options) : file.source;
		},
	};
}
