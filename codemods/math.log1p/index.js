import jscodeshift from 'jscodeshift';
import { transformMathPolyfill } from '../shared.js';

/** @import { Codemod, CodemodOptions } from '../../types.js' **/

/**
 * @returns {Codemod}
 */
export default function () {
	return {
		name: 'math.log1p',
		transform: ({ file, options }) => {
			const j = jscodeshift;
			const root = j(file.source);

			const dirty = transformMathPolyfill(
				'math.log1p/polyfill',
				'log1p',
				root,
				j,
			);

			return dirty ? root.toSource(options) : file.source;
		},
	};
}
