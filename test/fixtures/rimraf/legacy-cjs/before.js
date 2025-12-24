const rimraf = require('rimraf');

await rimraf('./dist');

export async function foo() {
  await rimraf('./dist');

  const someConst = './dist';
  await rimraf(someConst);
}

rimraf.sync('./dist');
