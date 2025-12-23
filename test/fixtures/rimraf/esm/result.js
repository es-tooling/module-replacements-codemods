import {rm} from 'node:fs/promises';
import {glob} from 'tinyglobby';

await rm('./dist', {recursive: true, force: true});

export async function foo() {
  await rm('./dist', {recursive: true, force: true});

  const someConst = './dist';
  await rm(someConst, {recursive: true, force: true});
}

// maxRetries
await rm('./dist', {recursive: true, force: true, maxRetries: 10});

// retryDelay
await rm('./dist', {recursive: true, force: true, retryDelay: 1000});

// glob
await Promise.all(
  (await glob('./dist/*.js')).map((filePath) =>
    rm(filePath, {recursive: true, force: true}))
);

// glob options
await Promise.all(
  (await glob('./dist/*.js', {
    dot: false
  })).map((filePath) =>
    rm(filePath, {recursive: true, force: true}))
);

// filter
// Note: filters are not migrated yet
await rm('./dist', {recursive: true, force: true,
  filter: () => {
    // some function, whatever
  }
});
