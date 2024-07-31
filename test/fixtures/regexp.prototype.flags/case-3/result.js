var assert = require('assert');

function getRegex() {
    return /a/;
}

assert(getRegex().flags === '');