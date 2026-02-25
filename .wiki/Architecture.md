# Architecture

## Design goals

The package has one job: adapt the hijri-core API to Moment.js idioms. No calendar logic belongs here. All date arithmetic, table lookups, and validation live in hijri-core, which is tested and maintained independently.

This constraint keeps moment-hijri-plus small, maintainable, and calendar-agnostic — it benefits automatically from any calendar or correctness improvements made in hijri-core.

## Plugin pattern

Moment.js plugins work by mutating `moment.fn` (the prototype for all moment instances) and the `moment` constructor itself. The canonical pattern is a single `install(momentInstance)` function that the caller invokes once:

```javascript
import installHijri from 'moment-hijri-plus';
installHijri(moment);
```

This approach avoids accidental double-registration, keeps the plugin stateless, and works with any moment instance — including custom ones created by `moment.utc()` or locale-scoped instances.

## Module augmentation

The TypeScript types are added to `moment.Moment` and `moment.MomentStatic` via declaration merging. This is the standard TypeScript way to extend third-party interfaces:

```typescript
declare module 'moment' {
  interface Moment {
    toHijri(options?: ConversionOptions): HijriDate | null;
    // ...
  }
  interface MomentStatic {
    fromHijri(hy: number, hm: number, hd: number, options?: ConversionOptions): Moment;
  }
}
```

The augmentation is emitted in the declaration files produced by tsup, so consumers get full type inference without any extra imports.

## Format token system

`formatHijri()` uses a single regex pass to identify Hijri tokens, replaces them with resolved strings, then passes the residual format string to `moment.format()`. This means Gregorian tokens (`YYYY`, `MMM`, `dddd`, etc.) resolve exactly as they would without the plugin.

The regex is ordered longest-match-first to prevent prefix collisions:

```javascript
/iYYYY|iYY|iMMMM|iMMM|iMM|iM|iDD|iD|iEEEE|iEEE|iE|ioooo|iooo/g
```

`iYYYY` must appear before `iYY` for obvious reasons; `iMMMM` before `iMMM` and `iMM`; `iDD` before `iD`; `iEEEE` before `iEEE`. The global flag allows the regex to find all non-overlapping tokens in one pass.

Moment's own bracket escaping (`[literal text]`) is preserved because it only runs during the `moment.format()` call on the residual string — any `[...]` sequences in the user's format string that don't contain Hijri tokens pass through untouched.

## Delegation to hijri-core

Every conversion call goes through hijri-core:

```
toHijri()    →  hijri-core.toHijri(date, options)
fromHijri()  →  hijri-core.toGregorian(hy, hm, hd, options)
```

hijri-core maintains a registry of calendar engines. The default engine is `uaq` (Umm al-Qura). Callers can switch to `fcna` (FCNA/ISNA) or register custom engines via `hijri-core`'s `registerCalendar()`.

Because moment-hijri-plus uses hijri-core as a peer dependency, the registry is shared — a calendar registered in application code via `hijri-core`'s `registerCalendar()` is immediately available to this plugin.

## Build output

tsup produces four files:

| File | Format | Purpose |
| --- | --- | --- |
| `dist/index.cjs` | CommonJS | `require()` in Node.js and bundlers in CJS mode |
| `dist/index.mjs` | ESM | `import` in Node.js, Vite, Rollup, esbuild |
| `dist/index.d.ts` | CJS declaration | Types for CJS consumers (`require`) |
| `dist/index.d.mts` | ESM declaration | Types for ESM consumers (`import`) |

Both `moment` and `hijri-core` are marked external, so they are not bundled. They resolve from the consumer's `node_modules` at runtime.

## Calendar coverage

| Calendar | ID | Range | Authority |
| --- | --- | --- | --- |
| Umm al-Qura | `uaq` | AH 1356-1500 (approx CE 1937-2077) | Official Saudi calendar |
| FCNA/ISNA | `fcna` | Calculated, no hard range | Fiqh Council of North America |

The UAQ calendar is tabular: dates are looked up in a precomputed table published by the Umm al-Qura University. Dates outside the table return `null`. The FCNA calendar uses an astronomical calculation rule and has no strict boundary.

---

[Home](Home) · [API Reference](API-Reference) · [Architecture](Architecture)
