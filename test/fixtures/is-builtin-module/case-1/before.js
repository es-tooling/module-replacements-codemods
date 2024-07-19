import isBuiltinModule from 'is-builtin-module';

isBuiltinModule('fs');
//=> true

isBuiltinModule('fs/promises');
//=> true

isBuiltinModule('node:fs/promises');
//=> true

isBuiltinModule('unicorn');
//=> false