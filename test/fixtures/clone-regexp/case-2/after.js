

const regex = /[a-z]/gi;

// Argument is a regex, with a `false` option
const clone1 = new RegExp(/[a-z]/gi);

// Argument is a regex, with a `true` option
const clone2 = new RegExp(/[a-z]/, 'g');

// Argument is an identifier, with a `true` option
const clone3 = new RegExp(regex, 'u');

// Argument is an identifier, with a `false` option
const clone4 = new RegExp(regex);

// Argument is regex, with several options
const clone5 = new RegExp(/[a-z]/);

// Both arguments are identifier
const opt = { ignoreCase: 1 === 1 };
const clone6 = new RegExp(regex);

// Multiple cloneRegexp
const clone7 = f(new RegExp(regex, 'y'), new RegExp(regex, 's'));

// Regex comes from a function
const clone8 = new RegExp(f(regex), 'm');
