# Performance Benchmarks

## Conversion performance

Measured on Node 22, Apple M2. Input: 1,000 random dates in range 1900-2076 CE.

| Operation | UAQ calendar | FCNA calendar |
|---|---|---|
| `m.iYear()` | ~0.6 µs/call | ~14 µs/call |
| `m.toHijri()` | ~0.6 µs/call | ~14 µs/call |
| `moment.fromHijri()` | ~0.7 µs/call | ~15 µs/call |
| `m.format('iD iMMMM iYYYY')` | ~1.4 µs/call | ~15 µs/call |

UAQ uses a precomputed lookup table (O(1) lookup). FCNA uses an arithmetic algorithm per call, which accounts for the ~24x difference.

For UI rendering the numbers are well below perceptible latency. In batch-processing scenarios (thousands of calls), prefer UAQ or run the work off the main thread.

## Bundle size

| Module | Min+gz |
|---|---|
| moment-hijri-plus (wrapper only) | ~1.6 KB |
| hijri-core/uaq (peer dep, UAQ engine) | ~5.3 KB |
| hijri-core/fcna (peer dep, FCNA engine) | ~3.1 KB |
| moment (peer dep, separate) | ~72 KB |

Moment.js itself is the dominant bundle cost. The plugin adds a negligible ~1.6 KB. If bundle size is a concern for a new project, Day.js + [dayjs-hijri-plus](https://github.com/acamarata/dayjs-hijri-plus) delivers the same Hijri API with a much smaller footprint.

## Reproducing the benchmarks

```javascript
import moment from 'moment';
import { installHijri } from 'moment-hijri-plus';

installHijri(moment);

const dates = Array.from({ length: 1000 }, (_, i) =>
  moment('1900-01-01').add(i * 26, 'days')
);

const start = performance.now();
for (const m of dates) {
  m.iYear();
}
const elapsed = performance.now() - start;
console.log(`${(elapsed / dates.length * 1000).toFixed(1)} µs/call`);
```

Run with `node --version` >= 20.
