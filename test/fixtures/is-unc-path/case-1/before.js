import isUncPath from 'is-unc-path';
const checkUnc = require('is-unc-path');

isUncPath('\\\\server\\share');
checkUnc('/foo/bar');
