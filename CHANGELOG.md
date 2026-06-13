# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.4] - 2026-06-13

### Fixed
- Published package now includes `dist/index.d.mts` so ESM type resolution under `node16`/`nodenext` resolves the import condition.

## [1.0.3] - 2026-06-10

### Fixed
- `.toHijri()` now converts the calendar date the moment instance displays (year/month/day
  components, respecting `.utc()` mode) rather than passing the raw instant to hijri-core.
  This eliminates wrong-Hijri-day results around UTC-midnight for hosts east or west of UTC.
  Requires hijri-core 1.0.3.

## [1.0.2] - 2026-05-30

### Changed
- Trim README to concise quick-start format (E6 P1 polish)
- Expand TSDoc on all exported symbols with full @param/@returns/@example blocks
- Add docs, postbuild, and improved coverage scripts
- Adopt shared config packages (@acamarata/eslint-config, tsconfig, prettier-config)

## [1.0.1] - 2026-05-28

### Changed
- Flatten exports map to ADR-015 standard (import/require/types at top level)
- Add "./package.json" export condition
- Add coverage script (c8 --reporter=lcov)
- Migrate CI from pnpm/action-setup to corepack enable

## [1.0.0] - 2026-05-28

### Added
- Initial release
