var isModuleBuiltin = require('is-builtin-module');

isModuleBuiltin('fs');
//=> true

isModuleBuiltin('fs/promises');
//=> true

isModuleBuiltin('node:fs/promises');
//=> true

isModuleBuiltin('unicorn');
//=> false