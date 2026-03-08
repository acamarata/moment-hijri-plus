import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import moment from 'moment';
import installHijri from './dist/index.mjs';

installHijri(moment);

describe('plugin installation', () => {
  it('installs all methods', () => {
    assert.equal(typeof moment.fn.toHijri, 'function');
    assert.equal(typeof moment.fn.hijriYear, 'function');
    assert.equal(typeof moment.fn.hijriMonth, 'function');
    assert.equal(typeof moment.fn.hijriDay, 'function');
    assert.equal(typeof moment.fn.isValidHijri, 'function');
    assert.equal(typeof moment.fn.formatHijri, 'function');
    assert.equal(typeof moment.fromHijri, 'function');
  });
});

describe('toHijri', () => {
  it('2023-03-23 => 1444/9/1', () => {
    const h = moment(new Date(2023, 2, 23, 12)).toHijri();
    assert.notEqual(h, null);
    assert.equal(h.hy, 1444);
    assert.equal(h.hm, 9);
    assert.equal(h.hd, 1);
  });

  it('2024-07-07 => 1446/1/1', () => {
    const h = moment(new Date(2024, 6, 7, 12)).toHijri();
    assert.notEqual(h, null);
    assert.equal(h.hy, 1446);
    assert.equal(h.hm, 1);
    assert.equal(h.hd, 1);
  });
});

describe('fromHijri', () => {
  it('1444/9/1 => 2023-03-23', () => {
    const m = moment.fromHijri(1444, 9, 1);
    const d = m.toDate();
    assert.equal(d.getFullYear(), 2023);
    assert.equal(d.getMonth(), 2);
    assert.equal(d.getDate(), 23);
  });

  it('1446/1/1 => 2024-07-07', () => {
    const m = moment.fromHijri(1446, 1, 1);
    const d = m.toDate();
    assert.equal(d.getFullYear(), 2024);
    assert.equal(d.getMonth(), 6);
    assert.equal(d.getDate(), 7);
  });

  it('throws on out-of-range Hijri date', () => {
    assert.throws(() => moment.fromHijri(999, 1, 1), /Invalid or out-of-range/);
  });
});

describe('accessors', () => {
  it('hijriYear, hijriMonth, hijriDay on 1 Ramadan 1444', () => {
    const m = moment(new Date(2023, 2, 23, 12));
    assert.equal(m.hijriYear(), 1444);
    assert.equal(m.hijriMonth(), 9);
    assert.equal(m.hijriDay(), 1);
  });
});

describe('formatHijri', () => {
  it('iYYYY-iMM-iDD', () => {
    const result = moment(new Date(2023, 2, 23, 12)).formatHijri('iYYYY-iMM-iDD');
    assert.equal(result, '1444-09-01');
  });

  it('iMMMM => Ramadan', () => {
    const result = moment(new Date(2023, 2, 23, 12)).formatHijri('iMMMM');
    assert.equal(result, 'Ramadan');
  });

  it('iEEEE on Thursday 2023-03-23', () => {
    const result = moment(new Date(2023, 2, 23, 12)).formatHijri('iEEEE');
    assert.equal(result, 'Yawm al-Khamis');
  });

  it('ioooo => AH', () => {
    const result = moment(new Date(2023, 2, 23, 12)).formatHijri('ioooo');
    assert.equal(result, 'AH');
  });

  it('mixed Hijri and Gregorian tokens', () => {
    const m = moment(new Date(2023, 2, 23, 12));
    const result = m.formatHijri('iYYYY [CE:] YYYY');
    assert.ok(result.includes('1444'), `Expected Hijri year in: ${result}`);
    assert.ok(result.includes('2023'), `Expected Gregorian year in: ${result}`);
  });
});

describe('isValidHijri', () => {
  it('true for valid date', () => {
    assert.equal(moment(new Date(2023, 2, 23, 12)).isValidHijri(), true);
  });
});

describe('FCNA calendar', () => {
  it('toHijri with { calendar: fcna } returns a HijriDate', () => {
    const h = moment(new Date(2023, 2, 23, 12)).toHijri({ calendar: 'fcna' });
    assert.notEqual(h, null);
    assert.equal(typeof h.hy, 'number');
    assert.equal(typeof h.hm, 'number');
    assert.equal(typeof h.hd, 'number');
  });
});
