const regex = /[a-z]/gi;

// Argument is a regex
const clone1 = new RegExp(/[a-z]/gi)/* Todo */;

// Argument is an identifier
const clone2 = new RegExp(regex)/* Todo */;

// Both arguments are identifier
const opt = { ignoreCase: 1 === 1 };
const clone3 = new RegExp(regex)/* Todo */;

// Multiple cloneRegexp
const clone4 = f(new RegExp(regex)/* Todo */, new RegExp(regex)/* Todo */);

// Regex comes from a function
const clone5 = new RegExp(f(regex))/* Todo */;