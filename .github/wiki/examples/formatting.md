# Formatting Examples

## Hijri format token reference

| Token | Output | Example |
|---|---|---|
| `iYYYY` | Full Hijri year | `1444` |
| `iMMMM` | Full month name | `Ramadan` |
| `iMMM` | Abbreviated month name | `Ram` |
| `iMM` | 2-digit month number | `09` |
| `iM` | Month number | `9` |
| `iDD` | 2-digit day | `01` |
| `iD` | Day number | `1` |

Tokens not prefixed with `i` are passed through to Moment.js as Gregorian tokens.

## Common format patterns

```typescript
import moment from 'moment';
import { installHijri } from 'moment-hijri-plus';

installHijri(moment);

const m = moment('2023-03-23');

// Day Month Year (long)
m.format('iD iMMMM iYYYY');
// '1 Ramadan 1444'

// Numeric date
m.format('iDD/iMM/iYYYY');
// '01/09/1444'

// Combined Gregorian and Hijri
m.format('YYYY-MM-DD (iD iMMMM iYYYY)');
// '2023-03-23 (1 Ramadan 1444)'

// ISO-style Hijri
m.format('iYYYY-iMM-iDD');
// '1444-09-01'
```

## Hijri month names

The `iMMMM` token returns the standard English transliteration for each Hijri month:

| Number | Full name | Abbreviated |
|---|---|---|
| 1 | Muharram | Muh |
| 2 | Safar | Saf |
| 3 | Rabi' al-Awwal | Rab1 |
| 4 | Rabi' al-Thani | Rab2 |
| 5 | Jumada al-Awwal | Jum1 |
| 6 | Jumada al-Thani | Jum2 |
| 7 | Rajab | Raj |
| 8 | Sha'ban | Sha |
| 9 | Ramadan | Ram |
| 10 | Shawwal | Shaw |
| 11 | Dhu al-Qa'dah | DhuQ |
| 12 | Dhu al-Hijjah | DhuH |

## Note on locales

Moment.js locale settings affect how Gregorian tokens are formatted but have no effect on Hijri tokens. The `iMMMM` token always produces the English transliterations shown above. To localize Hijri month names, build a lookup table with your own translations and use the `iM` (numeric) token to index into it.

## React example

```tsx
import moment from 'moment';
import { installHijri } from 'moment-hijri-plus';

installHijri(moment);

function HijriDate({ date }: { date: Date }) {
  const m = moment(date);
  return (
    <time dateTime={m.format('YYYY-MM-DD')}>
      {m.format('iD iMMMM iYYYY')}
    </time>
  );
}
```
