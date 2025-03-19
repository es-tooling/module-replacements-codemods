import jscodeshift from 'jscodeshift';
import { removeImport } from '../shared.js';

/** @import { Codemod, CodemodOptions } from '../../types.js' **/

/**
 * @returns {Codemod}
 */
export default function () {
	return {
		name: 'date',
		transform: ({ file, options }) => {
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
