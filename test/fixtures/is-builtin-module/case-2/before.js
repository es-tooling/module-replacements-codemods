import banana from 'is-builtin-module';

banana('fs');
//=> true

banana('fs/promises');
//=> true

banana('node:fs/promises');
//=> true

banana('unicorn');
//=> false