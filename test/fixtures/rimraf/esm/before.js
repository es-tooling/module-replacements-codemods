import {rimraf} from 'rimraf';

await rimraf('./dist');

export async function foo() {
  await rimraf('./dist');

  const someConst = './dist';
  await rimraf(someConst);
}

// maxRetries
await rimraf('./dist', {maxRetries: 10});

// retryDelay
await rimraf('./dist', {retryDelay: 1000});

// glob
await rimraf('./dist/*.js', {glob: true});

// glob options
await rimraf('./dist/*.js', {
  glob: {
    dot: false
  }
});

// filter
// Note: filters are not migrated yet
await rimraf('./dist', {
  filter: () => {
    // some function, whatever
  }
});
