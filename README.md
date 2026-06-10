# moment-hijri-plus

[![npm version](https://img.shields.io/npm/v/moment-hijri-plus.svg)](https://www.npmjs.com/package/moment-hijri-plus)
[![CI](https://github.com/acamarata/moment-hijri-plus/actions/workflows/ci.yml/badge.svg)](https://github.com/acamarata/moment-hijri-plus/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Moment.js plugin for Hijri calendar conversion and formatting. Delegates all calendar
logic to [hijri-core](https://github.com/acamarata/hijri-core), a zero-dependency Hijri
engine with pluggable calendar support (Umm al-Qura and FCNA/ISNA).

## Installation

```bash
pnpm add moment moment-hijri-plus hijri-core
```

Both `moment` and `hijri-core` are peer dependencies.

## Quick Start

```typescript
import moment from 'moment';
import installHijri from 'moment-hijri-plus';

installHijri(moment);

const m = moment(new Date(2023, 2, 23)); // 23 March 2023
m.toHijri();            // { hy: 1444, hm: 9, hd: 1 }  (1 Ramadan 1444 AH)
m.formatHijri('iD iMMMM iYYYY AH'); // '1 Ramadan 1444 AH'

moment.fromHijri(1446, 1, 1); // moment for 7 July 2024
```

## API Summary

Call `installHijri(moment)` once at startup to add these methods.

| Method | Returns | Description |
| --- | --- | --- |
| `toHijri(options?)` | `HijriDate \| null` | Convert to Hijri date object |
| `hijriYear(options?)` | `number \| null` | Hijri year |
| `hijriMonth(options?)` | `number \| null` | Hijri month (1-12) |
| `hijriDay(options?)` | `number \| null` | Hijri day |
| `isValidHijri(options?)` | `boolean` | True if date is within calendar range |
| `formatHijri(fmt, options?)` | `string` | Format with Hijri tokens; non-Hijri tokens pass through |
| `moment.fromHijri(hy, hm, hd, options?)` | `Moment` | Construct moment from Hijri date |

Pass `{ calendar: 'fcna' }` to switch from the default Umm al-Qura calendar to FCNA/ISNA.

Full API reference, format token table, and examples are in the
[project wiki](https://github.com/acamarata/moment-hijri-plus/wiki).

## Day boundaries and time zones

Conversions use the calendar date the moment instance displays, not the underlying UTC
instant. A `moment("2025-03-01")` parsed in any local timezone returns the Hijri date
for March 1st, 2025. A moment created with `.utc()` uses its UTC components.

Religious day-start at sunset is outside the scope of this package; it depends on
location and madhab, and must be handled at the application layer.

## Note on Moment.js

Moment.js is in maintenance mode. For new projects,
[dayjs-hijri-plus](https://github.com/acamarata/dayjs-hijri-plus) offers the same Hijri
support on Day.js. This package targets existing codebases already using Moment.js.

## Related

- [hijri-core](https://github.com/acamarata/hijri-core): Hijri calendar engine used internally
- [dayjs-hijri-plus](https://github.com/acamarata/dayjs-hijri-plus): same API for Day.js
- [luxon-hijri](https://github.com/acamarata/luxon-hijri): same API for Luxon
- [pray-calc](https://github.com/acamarata/pray-calc): Islamic prayer time calculation

## License

MIT. Copyright (c) 2026 Aric Camarata.
