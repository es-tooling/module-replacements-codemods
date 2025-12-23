# module-replacements-codemods

This repository aims to provide automated codemods for the modules provided in [module replacements](https://github.com/es-tooling/module-replacements). Feel free to use these codemods in any way you like.

## What is this project about?

There are many jokes in the software development ecosystem about the size of `node_modules` and JavaScript dependencies in general, for example dependencies like `is-even`, or `is-odd`. Fortunately, there are many individuals who are working on improving this situation (like for example the [e18e initiative](https://e18e.dev/)), but there are also individuals actively adding more and more unnecessary dependencies to popular projects that get millions of downloads, leading to bloated `node_modules` folders with tons of dependencies.

<img src="nodemodules.png" alt="Heaviest objects in the world ranked from lightest to heaviest starting with the sun a neutron star a black hole and finally node modules" style="max-width: 200px; display: block; margin-left: auto; margin-right: auto;">


This project aims to automate the cleanup of these dependencies for projects by implementing codemods to replace them. This will speed up the ecosystem cleanup efforts a lot by automating the process. For those of you who are unsure what codemods are, codemods are automatic transformations that run on your codebase programmatically. What that means is that you give a codemod some input source code, and it will output changed code, like for example cleanup of dependencies. For example, a codemod for `is-even` would result in:

Before:
```js
const isEven = require('is-even');
isEven(0);
```

After:
```js
(0 % 2 === 0);
```

For more examples of before/after's, take a look at the [test/fixtures](https://github.com/thepassle/module-replacements-codemods/tree/main/test/fixtures) folder, where you can see which replacements all of the codemods do.

All the codemods implemented in this repository should be listed in [es-tooling/module-replacements](https://github.com/es-tooling/module-replacements), if you would like to see a codemod for a package, please make sure it's in `module-replacements` first; feel free to create a PR to add it.

If you're interested in contributing a codemod, please read the [contribution instructions](#contributing).

## How do I use this?

This repository is intended to only hold the codemods for the packages provided by [module replacements](https://github.com/es-tooling/module-replacements). Additional tooling can import these codemods and use them how they like, like for example CLI tools. If you're interested in building such a tool; please do, and let us know what you've built with it!

In the future the `es-tooling` org will also be working on a CLI that wraps these codemods, among other things, but don't let that stop you from building something yourself!

## Contributing

If you would like to contribute a codemod for a module in [module replacements](https://github.com/es-tooling/module-replacements) or [polyfills](https://github.com/esm-dev/esm.sh/tree/main/server/embed/polyfills/npm), please feel free to create a pull request! 

All the codemods implemented in this repository should be listed in [es-tooling/module-replacements](https://github.com/es-tooling/module-replacements), if you would like to see a codemod for a package, please make sure it's in `module-replacements` first; feel free to create a PR to add it. You can run the `npm run which` script locally to see which of the packages listed in `module-replacements` have not been implemented as codemods yet.

So to get started, run the `npm run which` script, collect some before/after examples, and get started.

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
    to: "native",
    transform: ({ file }) => {
      return file.source.replaceAll("foo", "bar");
    },
  };
}
```

The codemod's `name` should be equal to the name of the package that you're trying to replace. So if you're writing a codemod for `is-array-buffer`, the `name` of the codemod should be `is-array-buffer`.

The codemod's `to` should be `"native"` in case it's being replaced with a built-in language replacement, or the name of the new package you're replacing it with.

The `transform` function is where you can implement your codemod magic. Feel free to use whatever codemod tool you're comfortable with, [ast-grep](https://github.com/ast-grep/ast-grep), [jscodeshift](https://github.com/facebook/jscodeshift), etc. It gets passed the `file` with a `source` property which is a string containing the contents of the file, which you can use to perform transformations on. Make sure to return the changed file from the `transform` function.

## For consumers of this project

Codemods are provided in the following structure:

```js
import codemod from 'module-replacements-codemods/codemods/<package-to-replace>/index.js'; // The default codemod we recommend
```

In case there are multiple replacement codemods for a package, the default codemod in the `<package-to-replace>/index.js` will be an our recommended replacement, but other codemods will be available under:

```js
import codemod from 'module-replacements-codemods/codemods/<package-to-replace>/<replacement-a>/index.js';
import codemod from 'module-replacements-codemods/codemods/<package-to-replace>/<replacement-b>/index.js';
```