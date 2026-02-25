# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.0.0] - 2026-02-25

### Added

- Initial release
- `toHijri()` instance method: convert a moment to a Hijri date object
- `hijriYear()`, `hijriMonth()`, `hijriDay()` convenience accessors
- `isValidHijri()` range check
- `formatHijri()` with 13 Hijri-specific format tokens
- `moment.fromHijri()` static factory for constructing moments from Hijri dates
- Umm al-Qura (UAQ) calendar support via hijri-core (default)
- FCNA/ISNA calendar support via hijri-core
- Full TypeScript definitions with module augmentation for `moment.Moment` and `moment.MomentStatic`
- Dual CJS/ESM build with separate type declaration files
