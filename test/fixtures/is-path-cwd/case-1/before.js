import isPathCwd from 'is-path-cwd';

console.log(isPathCwd(process.cwd()));
console.log(isPathCwd('foo'));
