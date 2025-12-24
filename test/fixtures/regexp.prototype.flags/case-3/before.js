var flags = require('regexp.prototype.flags');
var assert = require('assert');

function getRegex() {
    return /a/;
}

assert(flags(getRegex()) === '');