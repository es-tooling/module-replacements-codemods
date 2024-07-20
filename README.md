# module-replacements-codemods (name tbd)

This repository aims to provide automated codemods for the modules provided in [module replacements](https://github.com/es-tooling/module-replacements).

## What is this project about?

There are many jokes in the software development ecosystem about the size of `node_modules` and JavaScript dependencies in general, for example dependencies like `is-even`, or `is-odd`. Fortunately, there are many individuals who are working on improving this situation (like for example the [e18e initiative](https://e18e.dev/)), but there are also individuals actively adding more and more unnecessary dependencies to popular projects that get millions of downloads, leading to bloated `node_modules` folders with tons of dependencies.

![nodemodules.webp](Heaviest objects in the world, ranked from lightest to heaviest, starting with the sun, a neutron star, a black hole, and finally node modules)

This project aims to automate the cleanup of these dependencies for projects by implementing codemods to replace them. This will speed up the ecosystem cleanup efforts a lot by automating the process. For those of you who are unsure what codemods are, codemods are automatic transformations that run on your codebase programmatically. What that means is that you give a codemod some input source code, and it will output changed code, like for example cleanup of dependencies.

There are a lot of [packages](https://github.com/es-tooling/module-replacements) to create codemods for. While creating codemods for these packages is not very hard, there is simply _a lot_ of them, so we're looking for contributions! The codemods typically are very small and straightforward to implement; even if you've never written one before. With the help of [codemod.studio](https://codemod.com/studio) and the [contributing](#contributing) instructions down below, you should get up and running in no time. Being able to create codemods is a great skill to have in your developer toolset, but it's also really fun and satisfying to implement one, and at the same time you'll be contributing to a better ecosystem!


## Status

The status of this project is **in development**. There's is a very barebones CLI implemented, mostly just to have something there, and it's also not published to NPM yet, because the name/home of this project is still TBD. The goal of this repository, at the current time, is mainly to gather as many codemods for the packages in [module replacements](https://github.com/es-tooling/module-replacements) or [polyfills](https://github.com/esm-dev/esm.sh/tree/main/server/embed/polyfills/npm) as we can and to have a centralized place where people can [collaborate](#contributing) on those codemods.

Once we have a substantial amount of codemods implemented (or in parallel), we can work on creating an actually well-designed CLI so people can start using the codemods in their projects and remove package bloat.

## Contributing

If you would like to contribute a codemod for a module in [module replacements](https://github.com/es-tooling/module-replacements) or [polyfills](https://github.com/esm-dev/esm.sh/tree/main/server/embed/polyfills/npm), please feel free to create a pull request! Pick any module from [module replacements](https://github.com/es-tooling/module-replacements) or [polyfills](https://github.com/esm-dev/esm.sh/tree/main/server/embed/polyfills/npm), collect some before/after examples, and get started.

> If you're interested in contributing a codemod, but don't have much experience with _writing_ codemods, take a look at [codemod.studio](https://codemod.com/studio), which makes it really easy.

To start, you can fork and clone this project. Then execute the following steps:

```bash
git clone <your fork of this repo>
cd module-replacements-codemods
node ./scripts/scaffold-codemod.js <name of new codemod> # e.g.: is-array-buffer
```

> The name of the codemod should be equal to the name of the package you're trying to replace

This will scaffold all the needed files to create the codemod, and scaffold some tests:

- `codemods/index.js`: Your new codemod will be added to the list of available codemods
- `codemods/is-array-buffer/index.js`: The implementation of the codemod
- `test/fixtures/is-array-buffer/case-1/before.js`: The _before_ state of the code that you want to transform
- `test/fixtures/is-array-buffer/case-1/after.js`: The expected _after_ state of the code after applying your codemod

You can take a look at an existing codemod under the `./codemods/*` folder as a reference implementation; most of them are very small.

### Codemod implementation

A codemod is a function that gets passed an options object, and returns an object. Here's an example:

```js
export default function (options) {
  return {
    name: "foo-lib",
    transform: ({ file }) => {
      return file.source.replaceAll("foo", "bar");
    },
  };
}
```

The codemod's `name` should be equal to the name of the package that you're trying to replace. So if you're writing a codemod for `is-array-buffer`, the `name` of the codemod should be `is-array-buffer`.

The `transform` function is where you can implement your codemod magic. Feel free to use whatever codemod tool you're comfortable with, [ast-grep](https://github.com/ast-grep/ast-grep), [jscodeshift](https://github.com/facebook/jscodeshift), etc. It gets passed the `file` with a `source` property which is a string containing the contents of the file, which you can use to perform transformations on. Make sure to return the changed file from the `transform` function.
