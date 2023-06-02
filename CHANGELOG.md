# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
