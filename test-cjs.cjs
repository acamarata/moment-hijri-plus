'use strict';

const assert = require('node:assert/strict');
const moment = require('moment');
const installHijri = require('./dist/index.cjs');

installHijri.default(moment);

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
    process.exit(1);
  }
}

// 1. Plugin installs
test('plugin installs (CJS)', () => {
  assert.equal(typeof moment.fn.toHijri, 'function');
  assert.equal(typeof moment.fn.formatHijri, 'function');
  assert.equal(typeof moment.fromHijri, 'function');
});

// 2. toHijri
test('toHijri: 2023-03-23 => 1444/9/1 (CJS)', () => {
  const h = moment(new Date(2023, 2, 23, 12)).toHijri();
  assert.notEqual(h, null);
  assert.equal(h.hy, 1444);
  assert.equal(h.hm, 9);
  assert.equal(h.hd, 1);
});

// 3. fromHijri
test('fromHijri: 1444/9/1 => 2023-03-23 (CJS)', () => {
  const d = moment.fromHijri(1444, 9, 1).toDate();
  assert.equal(d.getFullYear(), 2023);
  assert.equal(d.getMonth(), 2);
  assert.equal(d.getDate(), 23);
});

// 4. formatHijri: numeric
test('formatHijri: iYYYY-iMM-iDD (CJS)', () => {
  const result = moment(new Date(2023, 2, 23, 12)).formatHijri('iYYYY-iMM-iDD');
  assert.equal(result, '1444-09-01');
});

// 5. formatHijri: month name
test('formatHijri: iMMMM => Ramadan (CJS)', () => {
  const result = moment(new Date(2023, 2, 23, 12)).formatHijri('iMMMM');
  assert.equal(result, 'Ramadan');
});

// 6. fromHijri throws for invalid date
test('fromHijri throws on out-of-range date (CJS)', () => {
  assert.throws(() => moment.fromHijri(999, 1, 1), /Invalid or out-of-range/);
});

// 7. hijriYear accessor
test('hijriYear: 1444 (CJS)', () => {
  assert.equal(moment(new Date(2023, 2, 23, 12)).hijriYear(), 1444);
});

// 8. isValidHijri
test('isValidHijri: true for valid date (CJS)', () => {
  assert.equal(moment(new Date(2023, 2, 23, 12)).isValidHijri(), true);
});

console.log(`\n${passed}/${total} tests passed`);
