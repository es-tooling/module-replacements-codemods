console.log(('unicorn' instanceof RegExp));
//=> false

console.log((/unicorn/ instanceof RegExp));
//=> true

console.log((new RegExp('unicorn') instanceof RegExp));
//=> true