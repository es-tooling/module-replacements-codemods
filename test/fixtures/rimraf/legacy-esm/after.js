import {rm} from 'node:fs/promises';
import {rmSync} from 'node:fs';

await rm('./dist', {recursive: true, force: true});

export async function foo() {
  await rm('./dist', {recursive: true, force: true});

  const someConst = './dist';
  await rm(someConst, {recursive: true, force: true});
}

rmSync('./dist', {recursive: true, force: true});
