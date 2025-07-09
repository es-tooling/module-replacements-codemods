import jscodeshift from 'jscodeshift';
import { removeImport } from '../shared.js';

/** @import { Codemod, CodemodOptions } from '../../types.js' **/

/**
 * @returns {Codemod}
 */
export default function () {
	return {
		name: 'es-set-tostringtag',
		to: 'native',
		transform: ({ file, options }) => {
			const j = jscodeshift;
			const root = j(file.source);
			let dirtyFlag = false;

			const { identifier } = removeImport('es-set-tostringtag', root, j);

			root
				.find(j.CallExpression, {
					callee: {
						type: 'Identifier',
						name: identifier,
					},
				})
				.replaceWith((path) => {
					const [obj, tag, options] = path.node.arguments;

					const force =
						options &&
						j.ObjectExpression.check(options) &&
						options.properties.some(
							(prop) =>
								j.Property.check(prop) &&
								j.Identifier.check(prop.key) &&
								prop.key.name === 'force' &&
								j.Literal.check(prop.value) &&
								prop.value.value === true,
						);

					const condition = j.unaryExpression(
						'!',
						j.callExpression(
							j.memberExpression(
								j.identifier('Object'),
								j.identifier('hasOwn'),
							),
							[
								obj,
								j.memberExpression(
									j.identifier('Symbol'),
									j.identifier('toStringTag'),
								),
							],
						),
					);

					const definePropertyCall = j.callExpression(
						j.memberExpression(
							j.identifier('Object'),
							j.identifier('defineProperty'),
						),
						[
							obj,
							j.memberExpression(
								j.identifier('Symbol'),
								j.identifier('toStringTag'),
							),
							j.objectExpression([
								j.property(
									'init',
									j.identifier('configurable'),
									j.literal(true),
								),
								j.property(
									'init',
									j.identifier('enumerable'),
									j.literal(false),
								),
								// @ts-ignore
								j.property('init', j.identifier('value'), tag),
								j.property('init', j.identifier('writable'), j.literal(false)),
							]),
						],
					);

					dirtyFlag = true;

					return force
						? definePropertyCall
						: j.logicalExpression('&&', condition, definePropertyCall);
				});

			return dirtyFlag ? root.toSource(options) : file.source;
		},
	};
}
