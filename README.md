# polyfills
A set of JavaScript polyfills

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

## Installation / Usage
This may be used via [unpkg.com](https://unpkg.com/browse/@shgysk8zer0/polyfills/),
as an [npm package](https://www.npmjs.com/package/@shgysk8zer0/polyfills), or 
as a submodule.

Simply adding the `<script>`, `import`, or `require()` is all you need to do.

### From CDN

### The simplest

```html
<script src="https://unpkg.com/@shgysk8zer0/polyfills/all.min.js" referrerpolicy="no-referrer" crossorigin="anonymous"  defer=""></script>
```

### With version and SRI

```html
<script src="https://unpkg.com/@shgysk8zer0/polyfills@0.0.4/all.min.js" referrerpolicy="no-referrer" crossorigin="anonymous" integrity="sha384-xoY6kDRPTvbDfGdGA3S6Ercudev5mWGBWZIErLB38f7TeN6hV7zof6WBpzMdx/z0" fetchpriority="high" defer=""></script>
```

### Using specific polyfills via `<script>`

**Note** that some polyfills require `type="module"`

```html
<script src="https://unpkg.com/@shgysk8zer0/polyfills/math.js" referrerpolicy="no-referrer" crossorigin="anonymous"  defer=""></script>
```

### Selecting specific polyfills as `import`s

```js
import 'https://unpkg.com/@shgysk8zer0/polyfills/abort.js';
import 'https://unpkg.com/@shgysk8zer0/polyfills/elementInternals.js';
/* ... */
```

## As an npm package

```bash
npm i @shgysk8zer0/polyfills
```

## As a git submodule

```bash
git submodule add https://github.com/shgysk8zer0/polyfills.git :path
```
