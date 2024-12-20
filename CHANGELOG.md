<!-- markdownlint-disable -->
# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [v0.4.8] - 2024-12-20

### Added
- Add CJS version for node via `node.cjs`

### Changed
- Update package `main` and `exports.require` to use `node.cjs`

## [v0.4.7] - 2024-11-06

### Changed
- Update `@aegisjsproject/sanitizer` with support for Declarative Shadow DOM

## [v0.4.6] - 2024-11-03

### Added
- Add [`CloseWatcher`](https://developer.mozilla.org/en-US/docs/Web/API/CloseWatcher) polyfill

### Changed
- Enhance `setHTMLUnsafe` and `getHTML` support

## [v0.4.5] - 2024-10-11

### Added
- Add polyfill for `customElements.getName`

## [v0.4.4] - 2024-10-09

### Added
- Add `Error.isError` (imperfect, but works)

### Fixed
- Fixed and simplicy `Array.prototype.uniqueBy`

## [v0.4.3] - 2024-09-17

### Added
- Add a few tests via `*.test.js` and `node --test`
- Add `browser.js` (replaces `all.js`)
- Add `RegExp.escape`
- Add `exports` to `package.json`

### Changed
- Update to node 20.9.0

### Deprecated
- Deprecated `all.js`/`all.min.js`

## [v0.4.2] - 2024-09-13

### Added
- Added `scheduler.yield`

### Changed
- Refactor `scheduler.postTask`

## [v0.4.1] - 2024-08-24

### Added
- Add [`URLPattern`](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern) via [`urlpattern-polyfill`](https://github.com/kenchris/urlpattern-polyfill)

### Fixed
- Fix error in `Uint8Array.prototype.toHex()`

## [v0.4.0] - 2024-08-19

### Added
- Add node version of polyfills (`node.js` and `node.min.js`)
- Add some automated tests (`test/node.js`)

### Changed
- Create local module from `string-dedent` instead of having as a dependency
- Update `rollup.config.js` to create all needed bundles

## [v0.3.14] - 2024-07-16

### Fixed
- Fix bad decoding in `Uint8Array.fromBase64`

## [v0.3.13] - 2024-07-16

### Fixed
- Fixed range error converting large `Uint8Array`s to base64

## [v0.3.12] - 2024-07-15

### Added
- Add `String.dedent` via [`string-dedent`](https://www.npmjs.com/package/string-dedent)
- Add `Promise.ownProperties` and `Promise.fromEntries`
- Add `Symbol.isWellKnown` and `Symbol.isRegistered`
- Add missing `URL.parse`

## [v0.3.11] - 2024-07-14

### Added
- Add polyfills for `setHTMLUnsafe` & `parseHTMLUnsafe` methods
- Add polyfills for `bytes` method in `Blob`, `Request`, and `Response`

## [v0.3.10] - 2024-04-10

### Added
- Add `Math.sumPrecise()`

### Changed
- Update `@aegisjsproject/sanitizer`

### Deprecated
- Deprecate old `Math.sum` method (now `Math.sumPrecise`)

## [v0.3.9] - 2024-04-03

### Changed
-  Update Sanitizer Config

## [v0.3.8] - 2024-04-02

### Fixed
- Load correct polyfill for Sanitizer API

## [v0.3.7] - 2024-04-01

### Changed
- Version bump (missed a version bump somewhere)

## [v0.3.6] - 2024-04-01

### Added
- Add `Aegisjsproject/trusted-types`

## [v0.3.5] - 2024-03-27

### Fixed
- Update `@aegisjsprject/sanitizer` to use `aegis-sanitizer#html` in `parseHTML`

## [v0.3.4] - 2024-03-27

### Fixed
- Update `@aegisjsproject/sanitizer` to fix appending rather than replacing

## [v0.3.3] - 2024-03-26

### Changed
- Switch to using `@aegisjsproject/sanitizer` instead of own implementation
- Now requires `aegis-sanitizer#html` policy instead of `sanitizer-raw#html`

### Removed
- Remove all scripts relating to Sanitizer API
- Completely remove ancient implementation of `Sanitizer` in `deprecated/`

## [v0.3.2] - 2024-03-09

### Added
- WIP implementation of the [Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API)
- Add `Array.isTemplateObject()`
- Add `Iterator.prototype.chunks()`

### Fixed
- Allow `blob:` URIs and `data-` attributes in sanitizer

## [v0.3.1] - 2024-01-31

### Added
- Add `Uint8Array` base64 + hex proposed methods
- Add `Math.sum()`

### Fixed
- Allow `data-*` attributes in sanitizer config

## [v0.3.0] - 2024-01-06

### Added
- Implement `Iterator.from`

### Changed
- Use iterators instead of generators iterator helper methods
- Update Set to conform to spec changes

## [v0.2.9] - 2023-12-10

### Fixed
- Fix misc issues with `Record` and `Tuple`

## [v0.2.8] - 2023-12-10

### Added
- Add `Record()` and `Tuple()`... kinda
- Add `JSON.parseImmutable()`

## [v0.2.7] - 2023-11-26

### Added
- Add `Array.prototype.lastIndex` and `Array.prototype.lastItem`

## [v0.2.6]- 2023-10-29

### Added
-  `cookieStore` now supports `partitioned`
- `<iframe credentialless>` & `<iframe loading="lazy">` (just the attributes / getters & setters)

### Removed
- Do not set `httpOnly` in `cookieStore`

### Changed
- Change default `sameSite` to `'lax'` for `cookieStore`s

## [v0.2.5] - 2023-10-26

### Added
- `Map.groupBy()`
- `Object.groupBy()`

### Deprecated
- `Array.group()`
- `Array.groupToMap()`

## [v0.2.4] - 2023-08-23

### Added
- Add polyfill for `HTMLFormElement.prototype.requestSubmit()`

## [v0.2.3] - 2023-07-09

### Added
- Add funding

## [v0.2.2] - 2023-07-09

### Added
- Add `Response.json()` static method

### Fixed
- Fix order of loading polyfills to support `arr.groupToMap()`

## [v0.2.1] - 2023-07-05

### Fixed
- `el.setHTML()` now replaces rather than appends

## [v0.2.0] - 2023-07-03

### Changed
- Update to node 20
- Update GH Action for npm publish
- Update npm scripts for versioning and locks

## [v0.1.2] - 2023-06-19

### Fixed
- Fix sanitizer config in `CSSStyleSheet.replaceSync()`

## [v0.1.1] - 2023-06-19

### Fixed
- Fix sanitizer config for `Document.parseHTML()` when parsing for `CSSStyleSheet`s

## [v0.1.0] - 2023-06-19

### Added
- Add shim for `Document.parseHTML`
- Add shim for constructable stylesheets (#21)
- Add `@shgysk8zer0/js-utils`

### Changed
- `el.setHTML()` now conforms to the updated draft Sanitizer API spec

### Removed
- Remove `eslint` and `rollup` and plugins

### Deprecated
- Sanitizer is now considered deprecated, pending changes to the spec

## [v0.0.8] - 2023-06-02

### Added
- `URL.canParse()` [#15]
- `utils.js` module with helper functions (`polyfillMethod()`, currently)

### Fixed
- Update GitHub Release Action with correct permissions

## [v0.0.7] - 2023-05-15

### Fixed
- Correctly check for support of `Sanitizer.prototype.sanitizeFor()`

## [v0.0.6] - 2023-05-15

### Added
- `main` & `module` to `package.json`

### Changed
- Update README (again)
- Update `rollup-plugin-terser` to `@rollup/plugin-terser`
- Fix order of releases in CHANGELOG

### Removed
- Remove polyfill for `<dialog>` from default bundle (moved to `legacy/`)

## [v0.0.5] - 2023-05-08

### Changed
- Update README with instructions

## [v0.0.4] - 2023-05-07

### Added
- Add missing `deprefixer.js` script

### [v0.0.3] - 2023-05-07

### Added
- Bundle `all.js` -> `all.min.js` on pack/pubilsh
