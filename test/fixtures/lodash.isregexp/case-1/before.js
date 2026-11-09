import banana from 'lodash.isregexp';

console.log(banana('unicorn'));
//=> false

console.log(banana(/unicorn/));
//=> true

console.log(banana(new RegExp('unicorn')));
//=> true
