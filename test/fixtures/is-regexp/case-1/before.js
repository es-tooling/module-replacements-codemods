import isRegexp from 'is-regexp';

console.log(isRegexp('unicorn'));
//=> false

console.log(isRegexp(/unicorn/));
//=> true

console.log(isRegexp(new RegExp('unicorn')));
//=> true