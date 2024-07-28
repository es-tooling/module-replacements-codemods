import cloneRegexp from 'clone-regexp';

const regex = /[a-z]/gi;

// Argument is a regex
const clone1 = cloneRegexp(/[a-z]/gi, { global: false });

// Argument is an identifier
const clone2 = cloneRegexp(regex, { unicode: true });

// Both arguments are identifier
const opt = { ignoreCase: 1 === 1 };
const clone3 = cloneRegexp(regex, opt);

// Multiple cloneRegexp
const clone4 = f(cloneRegexp(regex, { sticky: true }), cloneRegexp(regex, { dotAll: true }));

// Regex comes from a function
const clone5 = cloneRegexp(f(regex), { multiline: true });