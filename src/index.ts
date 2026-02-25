import moment from 'moment';
import {
  toHijri,
  toGregorian,
  hmLong,
  hmMedium,
  hwLong,
  hwShort,
  hwNumeric,
} from 'hijri-core';
import type { HijriDate, ConversionOptions } from './types';

declare module 'moment' {
  interface Moment {
    /**
     * Convert this moment to a Hijri date.
     * Returns null if the date falls outside the supported calendar range.
     */
    toHijri(options?: ConversionOptions): HijriDate | null;

    /** Return the Hijri year, or null if out of range. */
    hijriYear(options?: ConversionOptions): number | null;

    /** Return the Hijri month (1-12), or null if out of range. */
    hijriMonth(options?: ConversionOptions): number | null;

    /** Return the Hijri day, or null if out of range. */
    hijriDay(options?: ConversionOptions): number | null;

    /** Return true if this moment falls within the supported Hijri range. */
    isValidHijri(options?: ConversionOptions): boolean;

    /**
     * Format this moment using Hijri-aware format tokens.
     *
     * Hijri tokens: iYYYY iYY iMMMM iMMM iMM iM iDD iD iEEEE iEEE iE ioooo iooo
     * All other tokens are passed through to moment's own format().
     *
     * Returns an empty string if the date is outside the Hijri range.
     */
    formatHijri(formatStr: string, options?: ConversionOptions): string;
  }
}

// Regex matching all Hijri format tokens. Ordered longest-first so iYYYY is
// matched before iYY, iMMMM before iMMM, iDD before iD, iEEEE before iEEE.
const HIJRI_TOKEN_RE =
  /iYYYY|iYY|iMMMM|iMMM|iMM|iM|iDD|iD|iEEEE|iEEE|iE|ioooo|iooo/g;

/**
 * Escape a literal string so moment.format() treats it as literal text.
 * Wraps the value in square brackets, escaping any ] characters within.
 */
function escapeLiteral(value: string): string {
  return '[' + value.replace(/]/g, '][]') + ']';
}

/**
 * Install the Hijri plugin into the provided moment instance.
 *
 * @example
 * import moment from 'moment';
 * import installHijri from 'moment-hijri-plus';
 * installHijri(moment);
 */
function install(momentInstance: typeof moment): void {
  momentInstance.fn.toHijri = function (opts?: ConversionOptions): HijriDate | null {
    return toHijri(this.toDate(), opts);
  };

  momentInstance.fn.hijriYear = function (opts?: ConversionOptions): number | null {
    return this.toHijri(opts)?.hy ?? null;
  };

  momentInstance.fn.hijriMonth = function (opts?: ConversionOptions): number | null {
    return this.toHijri(opts)?.hm ?? null;
  };

  momentInstance.fn.hijriDay = function (opts?: ConversionOptions): number | null {
    return this.toHijri(opts)?.hd ?? null;
  };

  momentInstance.fn.isValidHijri = function (opts?: ConversionOptions): boolean {
    return this.toHijri(opts) !== null;
  };

  momentInstance.fn.formatHijri = function (
    formatStr: string,
    opts?: ConversionOptions,
  ): string {
    const hijri = this.toHijri(opts);
    if (!hijri) return '';
    const m = this;
    // Replace Hijri tokens with escaped literals, then pass the residual string
    // to moment.format() so all standard tokens (YYYY, MMM, etc.) resolve correctly.
    // Escaping is required because values like "Ramadan" would otherwise be
    // interpreted by moment as format tokens (R, a, m, etc.).
    const residual = formatStr.replace(HIJRI_TOKEN_RE, (token: string): string => {
      switch (token) {
        case 'iYYYY': return escapeLiteral(String(hijri.hy).padStart(4, '0'));
        case 'iYY':   return escapeLiteral(String(hijri.hy % 100).padStart(2, '0'));
        case 'iMMMM': return escapeLiteral(hmLong[hijri.hm - 1]);
        case 'iMMM':  return escapeLiteral(hmMedium[hijri.hm - 1]);
        case 'iMM':   return escapeLiteral(String(hijri.hm).padStart(2, '0'));
        case 'iM':    return escapeLiteral(String(hijri.hm));
        case 'iDD':   return escapeLiteral(String(hijri.hd).padStart(2, '0'));
        case 'iD':    return escapeLiteral(String(hijri.hd));
        case 'iEEEE': return escapeLiteral(hwLong[m.day()]);
        case 'iEEE':  return escapeLiteral(hwShort[m.day()]);
        case 'iE':    return escapeLiteral(String(hwNumeric[m.day()]));
        // Era tokens: both iooo and ioooo map to the common abbreviation.
        case 'iooo':
        case 'ioooo': return escapeLiteral('AH');
        default:      return token;
      }
    });
    return m.format(residual);
  };

  // Attach fromHijri as a property on the constructor. We use a type assertion
  // because MomentStatic augmentation produces a DTS visibility error with some
  // TypeScript configurations — attaching at runtime is equivalent and safe.
  (momentInstance as unknown as Record<string, unknown>).fromHijri = function (
    hy: number,
    hm: number,
    hd: number,
    opts?: ConversionOptions,
  ): moment.Moment {
    let greg: Date | null;
    try {
      greg = toGregorian(hy, hm, hd, opts);
    } catch {
      throw new Error(`Invalid or out-of-range Hijri date: ${hy}/${hm}/${hd}`);
    }
    if (!greg) {
      throw new Error(`Invalid or out-of-range Hijri date: ${hy}/${hm}/${hd}`);
    }
    // Construct from explicit year/month/day to avoid UTC-to-local timezone
    // shift when the Date object represents midnight UTC.
    return momentInstance([greg.getUTCFullYear(), greg.getUTCMonth(), greg.getUTCDate()]);
  };
}

export default install;
export type { HijriDate, ConversionOptions } from 'hijri-core';
