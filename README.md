# moment-hijri-plus

[![npm version](https://img.shields.io/npm/v/moment-hijri-plus.svg)](https://www.npmjs.com/package/moment-hijri-plus)
[![CI](https://github.com/acamarata/moment-hijri-plus/actions/workflows/ci.yml/badge.svg)](https://github.com/acamarata/moment-hijri-plus/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Moment.js plugin for Hijri calendar conversion and formatting. Delegates all calendar logic to [hijri-core](https://github.com/acamarata/hijri-core), a zero-dependency Hijri engine with pluggable calendar support.

## Installation

```bash
pnpm add moment moment-hijri-plus hijri-core
```

Both `moment` and `hijri-core` are peer dependencies and must be installed alongside this package.

## Quick Start

```javascript
import moment from 'moment';
import installHijri from 'moment-hijri-plus';

// Install the plugin once at startup.
installHijri(moment);

// Convert a Gregorian date to Hijri.
const m = moment(new Date(2023, 2, 23)); // 23 March 2023
const hijri = m.toHijri();
// => { hy: 1444, hm: 9, hd: 1 }  (1 Ramadan 1444 AH)

// Format using Hijri tokens.
m.formatHijri('iD iMMMM iYYYY AH');
// => '1 Ramadan 1444 AH'

// Construct a moment from a Hijri date.
const start = moment.fromHijri(1446, 1, 1);
// => moment representing 7 July 2024 (1 Muharram 1446 AH)
```

## API

### Instance methods

All methods are added to `moment.Moment` by calling `installHijri(moment)` once.

| Method | Signature | Description |
| --- | --- | --- |
| `toHijri` | `(options?) => HijriDate \| null` | Convert to Hijri. Returns `null` if the date is outside the calendar range. |
| `hijriYear` | `(options?) => number \| null` | Hijri year, or `null` if out of range. |
| `hijriMonth` | `(options?) => number \| null` | Hijri month (1-12), or `null` if out of range. |
| `hijriDay` | `(options?) => number \| null` | Hijri day, or `null` if out of range. |
| `isValidHijri` | `(options?) => boolean` | `true` if the date falls within the supported Hijri range. |
| `formatHijri` | `(formatStr, options?) => string` | Format using Hijri tokens. Returns `''` if out of range. Non-Hijri tokens pass through to `moment.format()`. |

### Static factory

| Method | Signature | Description |
| --- | --- | --- |
| `moment.fromHijri` | `(hy, hm, hd, options?) => Moment` | Create a moment from a Hijri date. Throws if the date is invalid or out of range. |

### Options

```typescript
interface ConversionOptions {
  calendar?: string; // 'uaq' (default) | 'fcna'
}
```

## Calendar Systems

| ID | Name | Description |
| --- | --- | --- |
| `uaq` | Umm al-Qura | Official calendar of Saudi Arabia. Tabular, covers AH 1356-1500. Default. |
| `fcna` | FCNA/ISNA | Fiqh Council of North America calculated calendar. |

Pass the calendar ID via `options`:

```javascript
m.toHijri({ calendar: 'fcna' });
moment.fromHijri(1444, 9, 1, { calendar: 'fcna' });
```

## Format Tokens

`formatHijri()` recognises the following tokens. All other tokens are passed through to `moment.format()`, so you can mix Hijri and Gregorian tokens freely.

| Token | Example | Description |
| --- | --- | --- |
| `iYYYY` | `1444` | Hijri year, 4 digits |
| `iYY` | `44` | Hijri year, 2 digits |
| `iMMMM` | `Ramadan` | Month long name |
| `iMMM` | `Ramadan` | Month medium name |
| `iMM` | `09` | Month, zero-padded |
| `iM` | `9` | Month, no padding |
| `iDD` | `01` | Day, zero-padded |
| `iD` | `1` | Day, no padding |
| `iEEEE` | `Yawm al-Khamis` | Weekday long name |
| `iEEE` | `Kham` | Weekday short name |
| `iE` | `5` | Weekday numeric (1=Sun, 7=Sat) |
| `ioooo` | `AH` | Era, long |
| `iooo` | `AH` | Era, short |

### Mixed format example

```javascript
m.formatHijri('iD iMMMM iYYYY [CE:] MMMM YYYY');
// => '1 Ramadan 1444 CE: March 2023'
```

Bracket escaping (`[...]`) is handled by moment's own formatter for the Gregorian portion.

## TypeScript

The plugin augments `moment.Moment` and `moment.MomentStatic` via module declaration merging, so type safety applies after the plugin is installed. No extra imports are needed for the types.

```typescript
import moment from 'moment';
import installHijri from 'moment-hijri-plus';
import type { HijriDate, ConversionOptions } from 'moment-hijri-plus';

installHijri(moment);

const hijri: HijriDate | null = moment().toHijri();
```

## Documentation

Full API reference, architecture notes, and calendar algorithm details are in the [project wiki](https://github.com/acamarata/moment-hijri-plus/wiki).

## Related

- [hijri-core](https://github.com/acamarata/hijri-core) — zero-dependency Hijri calendar engine used by this plugin
- [luxon-hijri](https://github.com/acamarata/luxon-hijri) — same Hijri support for Luxon
- [pray-calc](https://github.com/acamarata/pray-calc) — Islamic prayer time calculation

## License

MIT. Copyright (c) 2026 Aric Camarata.
