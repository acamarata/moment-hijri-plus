'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const moment = require('moment');
const installHijri = require('./dist/index.cjs');

installHijri.default(moment);

describe('CJS: plugin installation', () => {
  it('installs all methods', () => {
    assert.equal(typeof moment.fn.toHijri, 'function');
    assert.equal(typeof moment.fn.formatHijri, 'function');
    assert.equal(typeof moment.fromHijri, 'function');
  });
});

describe('CJS: toHijri', () => {
  it('2023-03-23 => 1444/9/1', () => {
    const h = moment(new Date(2023, 2, 23, 12)).toHijri();
    assert.notEqual(h, null);
    assert.equal(h.hy, 1444);
    assert.equal(h.hm, 9);
    assert.equal(h.hd, 1);
  });
});

describe('CJS: fromHijri', () => {
  it('1444/9/1 => 2023-03-23', () => {
    const d = moment.fromHijri(1444, 9, 1).toDate();
    assert.equal(d.getFullYear(), 2023);
    assert.equal(d.getMonth(), 2);
    assert.equal(d.getDate(), 23);
  });

  it('throws on out-of-range date', () => {
    assert.throws(() => moment.fromHijri(999, 1, 1), /Invalid or out-of-range/);
  });
});

describe('CJS: formatHijri', () => {
  it('iYYYY-iMM-iDD', () => {
    const result = moment(new Date(2023, 2, 23, 12)).formatHijri('iYYYY-iMM-iDD');
    assert.equal(result, '1444-09-01');
  });

  it('iMMMM => Ramadan', () => {
    const result = moment(new Date(2023, 2, 23, 12)).formatHijri('iMMMM');
    assert.equal(result, 'Ramadan');
  });
});

describe('CJS: accessors', () => {
  it('hijriYear: 1444', () => {
    assert.equal(moment(new Date(2023, 2, 23, 12)).hijriYear(), 1444);
  });
});

describe('CJS: isValidHijri', () => {
  it('true for valid date', () => {
    assert.equal(moment(new Date(2023, 2, 23, 12)).isValidHijri(), true);
  });
});
