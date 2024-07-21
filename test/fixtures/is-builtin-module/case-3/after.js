var {
  isBuiltin
} = require("node:module");

isBuiltin('fs');
//=> true

isBuiltin('fs/promises');
//=> true

isBuiltin('node:fs/promises');
//=> true

isBuiltin('unicorn');
//=> false