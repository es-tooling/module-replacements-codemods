import cloneRegexp from 'clone-regexp';

const regex = /[a-z]/gi;

// Argument is a regex, with a `false` option
const clone1 = cloneRegexp(/[a-z]/gi, { global: false });

// Argument is a regex, with a `true` option
const clone2 = cloneRegexp(/[a-z]/, { global: true });

// Argument is an identifier, with a `true` option
const clone3 = cloneRegexp(regex, { unicode: true });

// Argument is an identifier, with a `false` option
const clone4 = cloneRegexp(regex, { unicode: false });

// Argument is regex, with several options
const clone5 = cloneRegexp(/[a-z]/, { unicode: true, global: true });

// Both arguments are identifier
const opt = { ignoreCase: 1 === 1 };
const clone6 = cloneRegexp(regex, opt);

// Multiple cloneRegexp
const clone7 = f(cloneRegexp(regex, { sticky: true }), cloneRegexp(regex, { dotAll: true }));

// Regex comes from a function
const clone8 = cloneRegexp(f(regex), { multiline: true });
