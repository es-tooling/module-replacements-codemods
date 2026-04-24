

const regex = /[a-z]/gi;

// Argument is a regex
const clone1 = new RegExp(/[a-z]/gi, undefined);

// Argument is an identifier
const clone2 = new RegExp(regex, 'u');

// Both arguments are identifier
const opt = { ignoreCase: 1 === 1 };
const clone3 = new RegExp(regex, undefined);

// Multiple cloneRegexp
const clone4 = f(new RegExp(regex, 'y'), new RegExp(regex, 's'));

// Regex comes from a function
const clone5 = new RegExp(f(regex), 'm');
