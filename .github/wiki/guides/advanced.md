# Advanced Usage

## Switching calendars per call

Each method accepts an optional options argument:

```typescript
import moment from 'moment';
import hijri from 'moment-hijri-plus';

moment.extend(hijri);

const m = moment('2023-03-23');

const uaqYear = m.iYear();               // UAQ (default)
const fcnaYear = m.iYear({ calendar: 'fcna' }); // FCNA
```

Near month boundaries, UAQ and FCNA may differ by one day.

## Null safety

`m.toHijri()` returns `null` for dates outside UAQ range (approximately 1900-2076 CE). Guard before using:

```typescript
const hijri = m.toHijri();
if (hijri !== null) {
  console.log(hijri.hy, hijri.hm, hijri.hd);
}
```

## Combining with Moment.js locales

Moment.js locale settings affect Gregorian formatting but not Hijri tokens. Hijri tokens always produce the same English output regardless of locale. To localize Hijri month names, use `getHijriMonthName` from `date-fns-hijri` or build your own translation layer.

## Formatting alongside Gregorian tokens

Hijri tokens (`iYYYY`, `iMM`, `iDD`, `iMMMM`, etc.) coexist with Moment Gregorian tokens:

```typescript
m.format('YYYY-MM-DD (iD iMMMM iYYYY)');
// '2023-03-23 (1 Ramadan 1444)'
```

## Moment.js tree-shaking

Moment.js does not tree-shake well. If bundle size is a concern in a new project, consider migrating to Day.js + [dayjs-hijri-plus](https://github.com/acamarata/dayjs-hijri-plus) for the same Hijri API with significantly smaller bundles.

## TypeScript augmentation

The plugin augments Moment.js type definitions automatically:

```typescript
import moment from 'moment';
import hijri from 'moment-hijri-plus';

moment.extend(hijri);

const m = moment('2023-03-23');
const year: number = m.iYear(); // fully typed
```
