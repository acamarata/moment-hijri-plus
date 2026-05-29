# Quick Start

This guide covers the most common use cases in moment-hijri-plus. All examples use the default Umm al-Qura (UAQ) calendar.

## Installation

```bash
pnpm add moment moment-hijri-plus hijri-core
```

`moment` and `hijri-core` are required peer dependencies. Install both alongside this package.

## Load the plugin

```typescript
import moment from 'moment';
import hijri from 'moment-hijri-plus';

moment.extend(hijri);
```

After extending, all `moment()` instances gain Hijri methods.

## Convert a Gregorian date to Hijri

```typescript
import moment from 'moment';
import hijri from 'moment-hijri-plus';

moment.extend(hijri);

const m = moment('2023-03-23'); // 1 Ramadan 1444
console.log(m.iYear());  // 1444
console.log(m.iMonth()); // 9
console.log(m.iDate());  // 1
```

## Format with Hijri tokens

```typescript
m.format('iYYYY/iMM/iDD'); // '1444/09/01'
m.format('iD iMMMM iYYYY'); // '1 Ramadan 1444'
```

Hijri format tokens are prefixed with `i` to avoid conflicts with Moment.js Gregorian tokens.

## Convert a Hijri date to a Moment object

```typescript
import moment from 'moment';
import hijri from 'moment-hijri-plus';

moment.extend(hijri);

const m = moment.fromHijri(1444, 9, 1);
console.log(m.format('YYYY-MM-DD')); // '2023-03-23'
```

## Use the FCNA calendar

```typescript
const m = moment('2023-03-23');
console.log(m.iYear({ calendar: 'fcna' }));  // 1444
```

## Note on Moment.js

Moment.js is in maintenance mode. The Moment team recommends Luxon, Day.js, or date-fns for new projects. If you are starting fresh, consider [dayjs-hijri-plus](https://github.com/acamarata/dayjs-hijri-plus) as a compatible alternative.

## CommonJS

```js
const moment = require('moment');
const hijri = require('moment-hijri-plus');

moment.extend(hijri);

const m = moment('2023-03-23');
console.log(m.iYear(), m.iMonth(), m.iDate()); // 1444 9 1
```

## Next steps

- [API Reference](API-Reference) for the full method list
- [Architecture](Architecture) for how the plugin integrates with Moment.js
