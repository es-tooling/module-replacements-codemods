import jscodeshift from 'jscodeshift';
import { transformMathPolyfill } from '../shared.js';

/** @import { Codemod, CodemodOptions } from '../../types.js' **/

/**
 * @returns {Codemod}
 */
export default function () {
	return {
		name: 'math.log10',
		transform: ({ file, options }) => {
			const j = jscodeshift;
			const root = j(file.source);

			const dirty = transformMathPolyfill(
				'math.log10/polyfill',
				'log10',
				root,
				j,
			);

			return dirty ? root.toSource(options) : file.source;
		},
	};
}
