import { nativeReplacements, microUtilsReplacements } from 'module-replacements';
import { codemods } from '../codemods/index.js';

const all = [...nativeReplacements.moduleReplacements, ...microUtilsReplacements.moduleReplacements];

/**
 * Figure out which module replacements are not implemented as codemods yet
 */

const filteredModuleReplacements = all.filter(
	(replacement) => !Object.keys(codemods).includes(replacement.moduleName),
);

filteredModuleReplacements.forEach((replacement) => {
	console.log(`https://npmjs.com/package/${replacement.moduleName}`);
});

const implementedCodemods = Object.keys(codemods).length; // Number of implemented codemods
const implementedCodemodsPercentage =
	(implementedCodemods / all.length) * 100;

console.log(
	`\nNumber of implemented codemods: ${Object.keys(codemods).length}`,
);
console.log(
	`Total number of module replacements: ${all.length}`,
);
console.log(
	`Number of module replacements left to implement codemods for: ${filteredModuleReplacements.length}`,
);
console.log(
	`Percentage of codemods implemented: ${implementedCodemodsPercentage.toFixed(2)}%`,
);
