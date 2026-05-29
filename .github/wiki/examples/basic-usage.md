# Basic Usage Examples

## Setup

```typescript
import moment from 'moment';
import { installHijri } from 'moment-hijri-plus';

installHijri(moment);
```

## Convert today's date to Hijri

```typescript
const today = moment();
const h = today.toHijri();
// Returns null if date is outside UAQ range; guard before using

if (h !== null) {
  console.log(`${h.hd} / ${h.hm} / ${h.hy}`);
}
```

## Convert a known Gregorian date

```typescript
// 23 March 2023 = 1 Ramadan 1444 AH
const m = moment('2023-03-23');

console.log(m.iYear());   // 1444
console.log(m.iMonth());  // 9  (Ramadan is the 9th month)
console.log(m.iDate());   // 1
```

## Convert from Hijri to Gregorian

```typescript
const gregorian = moment.fromHijri(1444, 9, 1);
console.log(gregorian.format('YYYY-MM-DD'));  // '2023-03-23'
```

## Format with Hijri tokens

```typescript
const m = moment('2023-03-23');

m.format('iD iMMMM iYYYY');    // '1 Ramadan 1444'
m.format('iDD/iMM/iYYYY');     // '01/09/1444'
m.format('YYYY-MM-DD');        // '2023-03-23'  (Gregorian tokens still work)
m.format('YYYY (iYYYY/iM/iD)'); // '2023 (1444/9/1)'
```

## Use FCNA calendar

```typescript
const m = moment('2023-03-23');

const uaqYear  = m.iYear();                          // UAQ (default)
const fcnaYear = m.iYear({ calendar: 'fcna' });      // FCNA

console.log(uaqYear, fcnaYear);
// Near month boundaries, UAQ and FCNA may differ by one day
```

## CJS usage

```javascript
const moment = require('moment');
const { installHijri } = require('moment-hijri-plus');

installHijri(moment);

const m = moment('2023-03-23');
console.log(m.iYear());  // 1444
```
