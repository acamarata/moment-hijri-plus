# Basic Usage

## Setup

```typescript
import moment from 'moment';
import installHijri from 'moment-hijri-plus';

installHijri(moment);
```

## Convert today's date to Hijri

```typescript
const today = moment();
const h = today.toHijri();
// Returns null if date is outside the UAQ range; guard before use.

if (h !== null) {
  console.log(`${h.hd} / ${h.hm} / ${h.hy}`);
}
```

## Convert a known Gregorian date

```typescript
// 23 March 2023 = 1 Ramadan 1444 AH
const m = moment('2023-03-23');

console.log(m.hijriYear());  // 1444
console.log(m.hijriMonth()); // 9  (Ramadan is the 9th month)
console.log(m.hijriDay());   // 1
```

## Convert from Hijri to Gregorian

```typescript
const gregorian = moment.fromHijri(1444, 9, 1);
console.log(gregorian.format('YYYY-MM-DD')); // '2023-03-23'
```

## Format with Hijri tokens

```typescript
const m = moment('2023-03-23');

m.formatHijri('iD iMMMM iYYYY');         // '1 Ramadan 1444'
m.formatHijri('iDD/iMM/iYYYY');          // '01/09/1444'
m.formatHijri('YYYY-MM-DD');             // no Hijri tokens; passes through to moment.format
m.formatHijri('YYYY (iYYYY/iM/iD)');     // '2023 (1444/9/1)'
```

## Use FCNA calendar

```typescript
const m = moment('2023-03-23');

const uaqYear  = m.hijriYear();                        // UAQ (default)
const fcnaYear = m.hijriYear({ calendar: 'fcna' });    // FCNA

console.log(uaqYear, fcnaYear);
// Near month boundaries, UAQ and FCNA may differ by one day.
```

## CJS usage

```javascript
const moment = require('moment');
const installHijri = require('moment-hijri-plus').default;

installHijri(moment);

const m = moment('2023-03-23');
console.log(m.hijriYear()); // 1444
```
