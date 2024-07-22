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
		name: 'iterate-iterator',
		transform: ({ file }) => {
			const j = jscodeshift;
			const root = j(file.source);
			let isDirty = false;

			const { identifier } = removeImport('iterate-iterator', root, j);

			if (identifier) {
				const callExpressions = root.find(j.CallExpression, {
					callee: { type: 'Identifier', name: identifier },
				});

				for (const path of callExpressions.paths()) {
					const args = path.node.arguments;
					if (args.length === 1) {
						// Case: Converting an iterator to an array
						const [iterable] = args;
						const iterableArg =
							iterable.type === 'SpreadElement' ? iterable.argument : iterable;

						const wrappedIterable = j.objectExpression([
							j.property(
								'init',
								j.memberExpression(
									j.identifier('Symbol'),
									j.identifier('iterator'),
								),
								j.arrowFunctionExpression([], iterableArg),
							),
						]);

						if (
							wrappedIterable.properties[0].type !== 'SpreadProperty' &&
							wrappedIterable.properties[0].type !== 'SpreadElement'
						) {
							wrappedIterable.properties[0].computed = true;
						}

						const arrayFromExpression = j.callExpression(
							j.memberExpression(j.identifier('Array'), j.identifier('from')),
							[wrappedIterable],
						);
						j(path).replaceWith(arrayFromExpression);
						isDirty = true;
					} else if (args.length === 2) {
						// Case: Using a callback function
						const [iterable, callback] = args;
						const iterableArg =
							iterable.type === 'SpreadElement' ? iterable.argument : iterable;

						if (
							callback.type !== 'Identifier' &&
							callback.type !== 'FunctionExpression' &&
							callback.type !== 'ArrowFunctionExpression'
						) {
							continue;
						}

						const wrappedIterable = j.objectExpression([
							j.property(
								'init',
								j.memberExpression(
									j.identifier('Symbol'),
									j.identifier('iterator'),
								),
								j.arrowFunctionExpression([], iterableArg),
							),
						]);

						if (
							wrappedIterable.properties[0].type !== 'SpreadProperty' &&
							wrappedIterable.properties[0].type !== 'SpreadElement'
						) {
							wrappedIterable.properties[0].computed = true;
						}

						const forOfStatement = j.forOfStatement(
							j.variableDeclaration('const', [
								j.variableDeclarator(j.identifier('i')),
							]),
							wrappedIterable,
							j.blockStatement([
								j.expressionStatement(
									j.callExpression(
										callback.type === 'Identifier'
											? callback
											: j.parenthesizedExpression(callback),
										[j.identifier('i')],
									),
								),
							]),
						);
						j(path).replaceWith(forOfStatement);
						isDirty = true;
					}
				}
			}

			return isDirty ? root.toSource(options) : file.source;
		},
	};
}
