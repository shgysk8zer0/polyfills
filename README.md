# [@shgysk8zer0/polyfills](https://www.npmjs.com/package/@shgysk8zer0/rollup-import)

@shgysk8zer0/polyfills is a collection of JavaScript polyfills designed to provide
modern functionality in older browsers. This library provides a range of polyfills
for features including `AbortSignal`, `CookieStore`, `Sanitizer`, and many more.

[![CodeQL](https://github.com/shgysk8zer0/polyfills/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/shgysk8zer0/polyfills/actions/workflows/codeql-analysis.yml)
![Node CI](https://github.com/shgysk8zer0/polyfills/workflows/Node%20CI/badge.svg)
![Lint Code Base](https://github.com/shgysk8zer0/polyfills/workflows/Lint%20Code%20Base/badge.svg)

[![GitHub license](https://img.shields.io/github/license/shgysk8zer0/polyfills.svg)](https://github.com/shgysk8zer0/polyfills/blob/master/LICENSE)
[![GitHub last commit](https://img.shields.io/github/last-commit/shgysk8zer0/polyfills.svg)](https://github.com/shgysk8zer0/polyfills/commits/master)
[![GitHub release](https://img.shields.io/github/release/shgysk8zer0/polyfills?logo=github)](https://github.com/shgysk8zer0/polyfills/releases)
[![GitHub Sponsors](https://img.shields.io/github/sponsors/shgysk8zer0?logo=github)](https://github.com/sponsors/shgysk8zer0)

[![npm](https://img.shields.io/npm/v/@shgysk8zer0/polyfills)](https://www.npmjs.com/package/@shgysk8zer0/polyfills)
<!-- ![node-current](https://img.shields.io/node/v/@shgysk8zer0/polyfills) -->
![npm bundle size gzipped](https://img.shields.io/bundlephobia/minzip/@shgysk8zer0/polyfills)
[![npm](https://img.shields.io/npm/dw/@shgysk8zer0/polyfills?logo=npm)](https://www.npmjs.com/package/@shgysk8zer0/polyfills)

[![GitHub followers](https://img.shields.io/github/followers/shgysk8zer0.svg?style=social)](https://github.com/shgysk8zer0)
![GitHub forks](https://img.shields.io/github/forks/shgysk8zer0/polyfills.svg?style=social)
![GitHub stars](https://img.shields.io/github/stars/shgysk8zer0/polyfills.svg?style=social)
[![Twitter Follow](https://img.shields.io/twitter/follow/shgysk8zer0.svg?style=social)](https://twitter.com/shgysk8zer0)

[![Donate using Liberapay](https://img.shields.io/liberapay/receives/shgysk8zer0.svg?logo=liberapay)](https://liberapay.com/shgysk8zer0/donate "Donate using Liberapay")
- - -

- [Code of Conduct](./.github/CODE_OF_CONDUCT.md)
- [Contributing](./.github/CONTRIBUTING.md)
<!-- - [Security Policy](./.github/SECURITY.md) -->

## Installation

You can access @shgysk8zer0/polyfills in several ways:

### CDN

You can use a CDN to access the library. Add the following script tag to your
HTML file to load the latest version:

```html
<script src="https://unpkg.com/@shgysk8zer0/polyfills/all.min.js"></script>
```

#### With version and SRI

```html
<script src="https://unpkg.com/@shgysk8zer0/polyfills@0.0.6/all.min.js" referrerpolicy="no-referrer" crossorigin="anonymous" integrity="sha384-xoY6kDRPTvbDfGdGA3S6Ercudev5mWGBWZIErLB38f7TeN6hV7zof6WBpzMdx/z0" fetchpriority="high" defer=""></script>
```

### NPM

You can install the library as an NPM package and use it in your project. Use
the following command to install the library:

```bash
npm install @shgysk8zer0/polyfills
```

### Git Submodule

You can add the library as a Git submodule to your project. Use the following
command to add the library as a submodule:

```bash
git submodule add https://github.com/shgysk8zer0/polyfills.git [:path/to/destination]
```

## Usage

To use the polyfills in your project, simply import them using ES6 modules:

```javascript
import '@shgysk8zer0/polyfills';
// Or
import 'https://unpkg.com/@shgysk8zer0/polyfills/all.js';
```

This will load all the polyfills in the library.

If you only need certain polyfills, you can import them individually:

```javascript
import '@shgysk8zer0/polyfills/sanitizer.js';
import '@shgysk8zer0/polyfills/trustedTypes.js';
import '@shgysk8zer0/polyfills/elementInternals.js';
```

### Import Map

You can avoid installing altogether while keeping the familiar syntax by using
an [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap).
If you use Rollup, see [`@shgysk8zer0/rollup-import`](https://www.npmjs.com/package/@shgysk8zer0/rollup-import).
for more details.

```html
<script type="importmap">
{
  "imports": {
    "@shgysk8zer0/polyfills": "https://unpkg.com/@shgysk8zer0/polyfills@0.0.6/all.min.js",
    "@shgysk8zer0/polyfills/": "https://unpkg.com/@shgysk8zer0/polyfills@0.0.6/",
  }
}
</script>
```

## Contributing

If you would like to contribute to the library, please follow these steps:

1. Fork the repository.
2. Create a branch for your changes.
3. Make your changes.
4. Submit a pull request.

Please make sure that your changes are thoroughly tested and that they follow the same coding style as the rest of the library.

## License

@shgysk8zer0/polyfills is licensed under the MIT license. See the [LICENSE](https://github.com/shgysk8zer0/polyfills/blob/master/LICENSE) file for more details.
