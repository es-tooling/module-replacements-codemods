import isArguments from 'is-arguments';

const a = isArguments(arguments);
const b = !isArguments([]);
