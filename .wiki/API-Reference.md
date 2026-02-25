# API Reference

## Installation

```bash
pnpm add moment moment-hijri-plus hijri-core
```

`moment` and `hijri-core` are peer dependencies. Both must be installed.

## Plugin installation

```javascript
import moment from 'moment';
import installHijri from 'moment-hijri-plus';

// Call once at application startup.
installHijri(moment);
```

After this call, all methods below are available on every moment instance and on the `moment` constructor itself.

---

## Instance methods

### `toHijri(options?)`

Converts the moment to a Hijri date.

**Signature:** `(options?: ConversionOptions) => HijriDate | null`

Returns `null` if the date falls outside the supported calendar range (UAQ covers AH 1356-1500, approximately CE 1937-2077).

```javascript
const h = moment(new Date(2023, 2, 23)).toHijri();
// => { hy: 1444, hm: 9, hd: 1 }

const h = moment(new Date(2023, 2, 23)).toHijri({ calendar: 'fcna' });
```

**HijriDate fields:**

| Field | Type | Description |
| --- | --- | --- |
| `hy` | `number` | Hijri year |
| `hm` | `number` | Hijri month (1 = Muharram, 12 = Dhul Hijjah) |
| `hd` | `number` | Hijri day (1-30) |

---

### `hijriYear(options?)`

**Signature:** `(options?: ConversionOptions) => number | null`

```javascript
moment(new Date(2023, 2, 23)).hijriYear(); // => 1444
```

---

### `hijriMonth(options?)`

**Signature:** `(options?: ConversionOptions) => number | null`

Returns 1-12 (1 = Muharram).

```javascript
moment(new Date(2023, 2, 23)).hijriMonth(); // => 9  (Ramadan)
```

---

### `hijriDay(options?)`

**Signature:** `(options?: ConversionOptions) => number | null`

```javascript
moment(new Date(2023, 2, 23)).hijriDay(); // => 1
```

---

### `isValidHijri(options?)`

**Signature:** `(options?: ConversionOptions) => boolean`

Returns `true` if the date falls within the supported range of the chosen calendar.

```javascript
moment(new Date(2023, 2, 23)).isValidHijri(); // => true
moment(new Date(1900, 0, 1)).isValidHijri();  // => false (before UAQ range)
```

---

### `formatHijri(formatStr, options?)`

**Signature:** `(formatStr: string, options?: ConversionOptions) => string`

Format using Hijri-aware tokens. All tokens not listed below are passed through to `moment.format()`, so Gregorian tokens work as normal.

Returns `''` if the date is outside the Hijri range.

```javascript
moment(new Date(2023, 2, 23)).formatHijri('iD iMMMM iYYYY AH');
// => '1 Ramadan 1444 AH'

moment(new Date(2023, 2, 23)).formatHijri('iYYYY-iMM-iDD');
// => '1444-09-01'

// Mix Hijri and Gregorian tokens.
moment(new Date(2023, 2, 23)).formatHijri('iD iMMMM iYYYY [CE:] MMMM D, YYYY');
// => '1 Ramadan 1444 CE: March 23, 2023'
```

**Format tokens:**

| Token | Example output | Description |
| --- | --- | --- |
| `iYYYY` | `1444` | Hijri year, 4+ digits, zero-padded to 4 |
| `iYY` | `44` | Hijri year, last 2 digits, zero-padded |
| `iMMMM` | `Ramadan` | Month long name |
| `iMMM` | `Ramadan` | Month medium name |
| `iMM` | `09` | Month number, zero-padded |
| `iM` | `9` | Month number |
| `iDD` | `01` | Day, zero-padded |
| `iD` | `1` | Day |
| `iEEEE` | `Yawm al-Khamis` | Weekday long name |
| `iEEE` | `Kham` | Weekday short name |
| `iE` | `5` | Weekday numeric (1=Sunday, 7=Saturday) |
| `ioooo` | `AH` | Era, long |
| `iooo` | `AH` | Era, short |

---

## Static methods

### `moment.fromHijri(hy, hm, hd, options?)`

**Signature:** `(hy: number, hm: number, hd: number, options?: ConversionOptions) => Moment`

Creates a moment from a Hijri date. Throws `Error` if the date is invalid or outside the calendar range.

```javascript
const m = moment.fromHijri(1444, 9, 1);
m.format('YYYY-MM-DD'); // => '2023-03-23'

// With FCNA calendar.
const m2 = moment.fromHijri(1444, 9, 1, { calendar: 'fcna' });
```

---

## Options

```typescript
interface ConversionOptions {
  calendar?: string; // default: 'uaq'
}
```

| Calendar ID | Description |
| --- | --- |
| `uaq` | Umm al-Qura — official Saudi calendar, tabular, covers AH 1356-1500 |
| `fcna` | FCNA/ISNA — Fiqh Council of North America calculated calendar |

Custom calendars can be registered with hijri-core's `registerCalendar()`.

---

## TypeScript

All methods are typed via module augmentation. Import types from this package:

```typescript
import type { HijriDate, ConversionOptions } from 'moment-hijri-plus';
```

---

[Home](Home) · [API Reference](API-Reference) · [Architecture](Architecture)
