/**
 * @import { Codemod, CodemodOptions } from "../../types.js"
 */

import jscodeshift from 'jscodeshift';

import { removeImport } from '../shared.js';

/**
 * @param {CodemodOptions} [options]
 * @returns {Codemod}
 */
export default function (options) {
	return {
		name: 'is-primitive',
		to: 'native',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);

			const isPrimitiveImport = removeImport('is-primitive', root, j);

			if (isPrimitiveImport) {
				const val = j.identifier('val');
				const func = j.functionDeclaration(
					j.identifier('isPrimitive'),
					[val],
					j.blockStatement([
						j.ifStatement(
							j.binaryExpression(
								'===',
								j.unaryExpression('typeof', val),
								j.literal('object'),
							),
							j.blockStatement([
								j.returnStatement(
									j.binaryExpression('===', val, j.literal(null)),
								),
							]),
						),
						j.returnStatement(
							j.binaryExpression(
								'!==',
								j.unaryExpression('typeof', val, true),
								j.literal('function'),
							),
						),
					]),
				);

				root.find(j.Program).get('body').push(func);

				return root.toSource({ quote: 'single' });
			}

			return file.source;
		},
	};
}
