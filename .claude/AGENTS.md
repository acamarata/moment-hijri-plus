# moment-hijri-plus — PRI (Per-Repo Instructions)

**PPI:** `~/Sites/acamarata/.claude/CLAUDE.md`

## What This Is

Moment.js plugin for Hijri calendar conversion and formatting. Delegates all calendar
logic to hijri-core, a zero-dependency Hijri engine with pluggable calendar support.
Supports Umm al-Qura and FCNA/ISNA calendars. Installed via a function call rather than
`moment.extend()` — call `installHijri(moment)` once at startup.

**npm:** `moment-hijri-plus@1.0.0`
**Language:** TypeScript
**License:** MIT

## Key Technical Details

- Peer dependencies: `moment@^2.0.0`, `hijri-core@^1.0.0`
- Plugin pattern: `installHijri(moment)` called once at startup (not moment.fn.extend)
- Instance methods added: `toHijri()`, `hijriYear()`, `hijriMonth()`, `hijriDay()`, `isValidHijri()`, `formatHijri()`
- Static factory added: `moment.fromHijri(hy, hm, hd, options?)`
- `formatHijri()` Hijri tokens: `iD`, `iMMMM`, `iYYYY`, `iM`, `iDD`, `iMM` — non-Hijri tokens pass through to moment.format()
- Out-of-range inputs return `null` (instance methods) or empty string (formatHijri)
- `fromHijri()` throws if the date is invalid or out of range
- Dual CJS/ESM build via tsup
- Zero runtime dependencies (peer deps are provided by the consumer)

## Architecture

`src/index.ts` exports the default `installHijri` function and shared types. Built to
`dist/` (gitignored) with `.cjs` and `.mjs` outputs plus dual type declarations.

## Commands

- `pnpm install` — install dev deps
- `pnpm build` — tsup build
- `pnpm test` — run test.mjs + test-cjs.cjs
- `pnpm run typecheck` — tsc --noEmit

## Important Notes

- This is a plugin for Moment.js — call `installHijri(moment)` once before using any methods
- hijri-core provides the actual calendar engine — this package is a thin adapter
- Changes to hijri-core's API may require updates here
- moment is a peer dep — the consumer's installed moment instance is used (no bundled copy)
- Moment.js is in maintenance mode; this package targets existing moment users, not new projects
