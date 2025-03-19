import jscodeshift from 'jscodeshift';
import { removeImport } from '../shared.js';

/** @import { Codemod } from '../../types.js' **/

/**
 * @returns {Codemod}
 */
export default function () {
	return {
		name: 'es-string-html-methods',
		transform: ({ file, options }) => {
			const j = jscodeshift;
			const root = j(file.source);

			const methods = [
				'anchor',
				'big',
				'blink',
				'bold',
				'fixed',
				'fontcolor',
				'fontsize',
				'italics',
				'link',
				'small',
				'strike',
				'sub',
				'sup',
			];

			// Remove all imports
			const entries = methods.map((method) => [
				method,
				removeImport(`es-string-html-methods/${method}`, root, j).identifier,
			]);
			const methodIdentifiers = Object.fromEntries(entries);
			methods.forEach((method) => {
				removeImport(`es-string-html-methods/${method}/auto`, root, j);
			});
			removeImport('es-string-html-methods/auto', root, j);

			// Replace all calls, e.g. blink('foo') -> 'foo'.blink()
			methods.forEach((method) => {
				root
					.find(j.CallExpression, {
						callee: {
							type: 'Identifier',
							name: methodIdentifiers[method],
						},
					})
					.forEach((path) => {
						const args = path.node.arguments;
						if (args.length === 0) return;
						if (
							j.Expression.check(args[0]) &&
							!j.SpreadElement.check(args[0])
						) {
							const additionalArgs = args.length > 1 ? [args[1]] : [];
							path.replace(
								j.memberExpression(
									args[0],
									j.callExpression(j.identifier(method), additionalArgs),
								),
							);
						}
					});
			});

			return root.toSource(options);
		},
	};
}
