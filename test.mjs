import assert from 'node:assert/strict';
import moment from 'moment';
import installHijri from './dist/index.mjs';

installHijri(moment);

let passed = 0;
let total = 0;

function test(name, fn) {
  total++;
  try {
    fn();
    console.log(`[${name}]... PASS`);
    passed++;
  } catch (err) {
    console.error(`[${name}]... FAIL: ${err.message}`);
    process.exitCode = 1;
  }
}

// 1. Plugin installs
test('plugin installs', () => {
  assert.equal(typeof moment.fn.toHijri, 'function');
  assert.equal(typeof moment.fn.hijriYear, 'function');
  assert.equal(typeof moment.fn.hijriMonth, 'function');
  assert.equal(typeof moment.fn.hijriDay, 'function');
  assert.equal(typeof moment.fn.isValidHijri, 'function');
  assert.equal(typeof moment.fn.formatHijri, 'function');
  assert.equal(typeof moment.fromHijri, 'function');
});

// 2. toHijri: 1 Ramadan 1444 AH
test('toHijri: 2023-03-23 => 1444/9/1', () => {
  const h = moment(new Date(2023, 2, 23, 12)).toHijri();
  assert.notEqual(h, null);
  assert.equal(h.hy, 1444);
  assert.equal(h.hm, 9);
  assert.equal(h.hd, 1);
});

// 3. toHijri: 1 Muharram 1446 AH
test('toHijri: 2024-07-07 => 1446/1/1', () => {
  const h = moment(new Date(2024, 6, 7, 12)).toHijri();
  assert.notEqual(h, null);
  assert.equal(h.hy, 1446);
  assert.equal(h.hm, 1);
  assert.equal(h.hd, 1);
});

// 4. fromHijri: 1444/9/1 => 2023-03-23
test('fromHijri: 1444/9/1 => 2023-03-23', () => {
  const m = moment.fromHijri(1444, 9, 1);
  const d = m.toDate();
  assert.equal(d.getFullYear(), 2023);
  assert.equal(d.getMonth(), 2); // March = 2
  assert.equal(d.getDate(), 23);
});

// 5. fromHijri: 1446/1/1 => 2024-07-07
test('fromHijri: 1446/1/1 => 2024-07-07', () => {
  const m = moment.fromHijri(1446, 1, 1);
  const d = m.toDate();
  assert.equal(d.getFullYear(), 2024);
  assert.equal(d.getMonth(), 6); // July = 6
  assert.equal(d.getDate(), 7);
});

// 6. hijriYear / hijriMonth / hijriDay
test('hijriYear, hijriMonth, hijriDay on 1 Ramadan 1444', () => {
  const m = moment(new Date(2023, 2, 23, 12));
  assert.equal(m.hijriYear(), 1444);
  assert.equal(m.hijriMonth(), 9);
  assert.equal(m.hijriDay(), 1);
});

// 7. formatHijri: numeric format
test('formatHijri: iYYYY-iMM-iDD', () => {
  const result = moment(new Date(2023, 2, 23, 12)).formatHijri('iYYYY-iMM-iDD');
  assert.equal(result, '1444-09-01');
});

// 8. formatHijri: long month name
test('formatHijri: iMMMM => Ramadan', () => {
  const result = moment(new Date(2023, 2, 23, 12)).formatHijri('iMMMM');
  assert.equal(result, 'Ramadan');
});

// 9. formatHijri: long weekday name (Thursday = Yawm al-Khamis)
test('formatHijri: iEEEE on Thursday 2023-03-23', () => {
  const result = moment(new Date(2023, 2, 23, 12)).formatHijri('iEEEE');
  assert.equal(result, 'Yawm al-Khamis');
});

// 10. formatHijri: era token
test('formatHijri: ioooo => AH', () => {
  const result = moment(new Date(2023, 2, 23, 12)).formatHijri('ioooo');
  assert.equal(result, 'AH');
});

// 11. isValidHijri: returns true for in-range date
test('isValidHijri: true for valid date', () => {
  assert.equal(moment(new Date(2023, 2, 23, 12)).isValidHijri(), true);
});

// 12. FCNA calendar option
test('toHijri with { calendar: fcna } returns a HijriDate', () => {
  const h = moment(new Date(2023, 2, 23, 12)).toHijri({ calendar: 'fcna' });
  assert.notEqual(h, null);
  assert.equal(typeof h.hy, 'number');
  assert.equal(typeof h.hm, 'number');
  assert.equal(typeof h.hd, 'number');
});

// 13. fromHijri throws for out-of-range date
test('fromHijri throws on out-of-range Hijri date', () => {
  assert.throws(() => moment.fromHijri(999, 1, 1), /Invalid or out-of-range/);
});

// 14. formatHijri: mixed Hijri and Gregorian tokens
test('formatHijri: mixed Hijri and Gregorian tokens', () => {
  const m = moment(new Date(2023, 2, 23, 12));
  const result = m.formatHijri('iYYYY [CE:] YYYY');
  // Hijri year should be 1444; Gregorian year should be 2023.
  assert.ok(result.includes('1444'), `Expected Hijri year in: ${result}`);
  assert.ok(result.includes('2023'), `Expected Gregorian year in: ${result}`);
});

console.log(`\n${passed}/${total} tests passed`);
