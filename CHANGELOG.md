# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
