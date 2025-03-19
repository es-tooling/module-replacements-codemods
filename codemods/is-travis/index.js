import jscodeshift from 'jscodeshift';
import { removeImport } from '../shared.js';

/** @import { Codemod } from '../../types.js' **/

/**
 * @returns {Codemod}
 */
export default function () {
	return {
		name: 'is-travis',
		transform: ({ file, options }) => {
			const j = jscodeshift;
			const root = j(file.source);
			let dirtyFlag = false;

			const { identifier } = removeImport('is-travis', root, j);
			root.find(j.Identifier, { name: identifier }).replaceWith(() => {
				dirtyFlag = true;
				return j.parenthesizedExpression(
					j.binaryExpression(
						'in',
						j.literal('TRAVIS'),
						j.memberExpression(j.identifier('process'), j.identifier('env')),
					),
				);
			});

			return dirtyFlag ? root.toSource(options) : file.source;
		},
	};
}
