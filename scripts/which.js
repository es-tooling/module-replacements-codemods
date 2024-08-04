import {
	nativeReplacements,
	microUtilsReplacements,
} from 'module-replacements';
import { codemods } from '../index.js';

const all = [
	...nativeReplacements.moduleReplacements,
	...microUtilsReplacements.moduleReplacements,
];

/**
 * Figure out which module replacements are not implemented as codemods yet
 */

const filteredModuleReplacements = all.filter(
	(replacement) => !Object.keys(codemods).includes(replacement.moduleName),
);

filteredModuleReplacements.forEach((replacement) => {
	console.log(`https://npmjs.com/package/${replacement.moduleName}`);
});

const implementedCodemodsNumber = Object.keys(codemods).length;
const implementedFilteredCodemodsNumber =
	all.length - filteredModuleReplacements.length || 0;
const implementedCodemodsPercentage =
	(implementedFilteredCodemodsNumber / all.length) * 100;

console.log(
	`\nNumber of all implemented codemods: ${implementedCodemodsNumber}`,
);
console.log(
	`Total number of native and micro-utils module replacements: ${all.length}`,
);
console.log(
	`Number of module replacements left to implement codemods for: ${filteredModuleReplacements.length}`,
);
console.log(
	`Percentage of codemods implemented: ${implementedCodemodsPercentage.toFixed(2)}%`,
);
