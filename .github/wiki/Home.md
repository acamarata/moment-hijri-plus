# moment-hijri-plus

A Moment.js plugin for Hijri calendar conversion and formatting. All calendar arithmetic is handled by [hijri-core](https://github.com/acamarata/hijri-core), keeping this package thin and focused.

## What it does

- Converts any moment to a Hijri date object (`{ hy, hm, hd }`)
- Formats moments using Hijri-specific tokens mixed freely with standard Moment format tokens
- Constructs moments from Hijri dates via `moment.fromHijri()`
- Supports Umm al-Qura (UAQ) and FCNA/ISNA calendars

## Pages

- [API Reference](API-Reference): complete method signatures and examples
- [Architecture](Architecture): design rationale, token system, calendar delegation

## Quick start

```bash
pnpm add moment moment-hijri-plus hijri-core
```

```javascript
import moment from 'moment';
import installHijri from 'moment-hijri-plus';

installHijri(moment);

moment(new Date(2023, 2, 23)).toHijri();
// => { hy: 1444, hm: 9, hd: 1 }  (1 Ramadan 1444 AH)

moment(new Date(2023, 2, 23)).formatHijri('iD iMMMM iYYYY AH');
// => '1 Ramadan 1444 AH'

moment.fromHijri(1446, 1, 1).format('YYYY-MM-DD');
// => '2024-07-07'
```

## Related packages

- [hijri-core](https://github.com/acamarata/hijri-core): the calendar engine
- [luxon-hijri](https://github.com/acamarata/luxon-hijri): same support for Luxon
- [pray-calc](https://github.com/acamarata/pray-calc): Islamic prayer time calculation

---

[Home](Home) · [API Reference](API-Reference) · [Architecture](Architecture)
