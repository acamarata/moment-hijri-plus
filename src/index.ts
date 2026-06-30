import moment from "moment";
import type { Moment as MomentInstance } from "moment";
import { toHijri, toGregorian, hmLong, hmMedium, hwLong, hwShort, hwNumeric } from "hijri-core";
import type { HijriDate, ConversionOptions } from "./types";

declare module "moment" {
  interface MomentStatic {
    /**
     * Construct a moment from a Hijri date.
     *
     * Delegates to hijri-core's `toGregorian()` to resolve the Gregorian equivalent,
     * then constructs the moment from the explicit UTC year/month/day to avoid timezone
     * drift when the Date object represents midnight UTC.
     *
     * @param hy - Hijri year.
     * @param hm - Hijri month (1 = Muharram, 12 = Dhul Hijjah).
     * @param hd - Hijri day (1-30).
     * @param options - Calendar selection. Default: `{ calendar: 'uaq' }`.
     * @returns A moment positioned at the Gregorian equivalent of the given Hijri date.
     * @throws {Error} If the date is invalid or outside the chosen calendar's range.
     * @example
     * moment.fromHijri(1444, 9, 1).format('YYYY-MM-DD'); // '2023-03-23'
     */
    fromHijri(hy: number, hm: number, hd: number, options?: ConversionOptions): MomentInstance;
  }

  interface Moment {
    /**
     * Convert this moment to a Hijri date.
     *
     * Converts the calendar date this moment instance displays (year/month/day) to a
     * Hijri date via hijri-core's `toHijri()`. The conversion is independent of the
     * host machine's timezone: a moment in UTC mode uses its UTC components, and a
     * moment in local mode uses its local components. The raw instant (milliseconds
     * since epoch) is never passed directly to the calendar engine.
     *
     * The calendar engine performs a table lookup (UAQ) or astronomical calculation (FCNA).
     *
     * @param options - Calendar selection. Default: `{ calendar: 'uaq' }`.
     * @returns A `HijriDate` object `{ hy, hm, hd }`, or `null` if the date is outside
     *   the supported range (UAQ covers approximately CE 1900-2076).
     * @example
     * moment(new Date(2023, 2, 23)).toHijri();
     * // => { hy: 1444, hm: 9, hd: 1 }
     */
    toHijri(options?: ConversionOptions): HijriDate | null;

    /**
     * Return the Hijri year.
     *
     * Convenience wrapper around `toHijri()`. Use `toHijri()` when you need all three
     * fields to avoid redundant calendar lookups.
     *
     * @param options - Calendar selection. Default: `{ calendar: 'uaq' }`.
     * @returns The Hijri year, or `null` if the date is outside the calendar range.
     * @example
     * moment(new Date(2023, 2, 23)).hijriYear(); // => 1444
     */
    hijriYear(options?: ConversionOptions): number | null;

    /**
     * Return the Hijri month (1-12).
     *
     * 1 = Muharram, 9 = Ramadan, 12 = Dhul Hijjah.
     *
     * @param options - Calendar selection. Default: `{ calendar: 'uaq' }`.
     * @returns The Hijri month number, or `null` if out of range.
     * @example
     * moment(new Date(2023, 2, 23)).hijriMonth(); // => 9 (Ramadan)
     */
    hijriMonth(options?: ConversionOptions): number | null;

    /**
     * Return the Hijri day (1-30).
     *
     * @param options - Calendar selection. Default: `{ calendar: 'uaq' }`.
     * @returns The Hijri day number, or `null` if out of range.
     * @example
     * moment(new Date(2023, 2, 23)).hijriDay(); // => 1
     */
    hijriDay(options?: ConversionOptions): number | null;

    /**
     * Return `true` if this moment falls within the supported Hijri range.
     *
     * Equivalent to `moment.toHijri(opts) !== null`. Use as a guard before
     * calling `toHijri()` on user-supplied dates that may predate CE 1900.
     *
     * @param options - Calendar selection. Default: `{ calendar: 'uaq' }`.
     * @returns `true` if the date is within range, `false` otherwise.
     * @example
     * moment(new Date(2023, 2, 23)).isValidHijri(); // => true
     * moment(new Date(1800, 0, 1)).isValidHijri();  // => false
     */
    isValidHijri(options?: ConversionOptions): boolean;

    /**
     * Format this moment using Hijri-aware format tokens.
     *
     * Hijri tokens (prefix `i`) are resolved to their Arabic calendar equivalents
     * via a single regex pass. The residual format string is passed to `moment.format()`
     * so all standard Gregorian tokens resolve normally. This allows mixing Hijri and
     * Gregorian tokens in a single format string.
     *
     * Supported Hijri tokens: `iYYYY`, `iYY`, `iMMMM`, `iMMM`, `iMM`, `iM`,
     * `iDD`, `iD`, `iEEEE`, `iEEE`, `iE`, `ioooo`, `iooo`.
     *
     * @param formatStr - Format string. Hijri tokens and Moment.js tokens may be mixed freely.
     * @param options - Calendar selection. Default: `{ calendar: 'uaq' }`.
     * @returns The formatted string, or `''` if the date is outside the Hijri range.
     * @example
     * moment(new Date(2023, 2, 23)).formatHijri('iD iMMMM iYYYY AH');
     * // => '1 Ramadan 1444 AH'
     *
     * moment(new Date(2023, 2, 23)).formatHijri('iD iMMMM iYYYY [CE:] MMMM D, YYYY');
     * // => '1 Ramadan 1444 CE: March 23, 2023'
     */
    formatHijri(formatStr: string, options?: ConversionOptions): string;
  }
}

// Regex matching all Hijri format tokens. Ordered longest-first so iYYYY is
// matched before iYY, iMMMM before iMMM, iDD before iD, iEEEE before iEEE.
const HIJRI_TOKEN_RE = /iYYYY|iYY|iMMMM|iMMM|iMM|iM|iDD|iD|iEEEE|iEEE|iE|ioooo|iooo/g;

/**
 * Escape a literal string so moment.format() treats it as literal text.
 * Wraps the value in square brackets, escaping any ] characters within.
 */
function escapeLiteral(value: string): string {
  return "[" + value.replace(/]/g, "][]") + "]";
}

/**
 * Install the Hijri plugin into the provided Moment.js instance.
 *
 * Mutates `momentInstance.fn` to add instance methods (`toHijri`, `hijriYear`,
 * `hijriMonth`, `hijriDay`, `isValidHijri`, `formatHijri`) and attaches
 * `momentInstance.fromHijri` as a static factory. Call once at application startup.
 *
 * The call is idempotent: calling it a second time overwrites the methods with
 * identical implementations.
 *
 * @param momentInstance - The Moment.js constructor to augment. Pass your imported
 *   `moment` directly. Works with any moment instance, including locale-scoped ones.
 * @example
 * import moment from 'moment';
 * import installHijri from 'moment-hijri-plus';
 *
 * installHijri(moment);
 *
 * moment(new Date(2023, 2, 23)).toHijri();
 * // => { hy: 1444, hm: 9, hd: 1 }
 */
function install(momentInstance: typeof moment): void {
  momentInstance.fn.toHijri = function (opts?: ConversionOptions): HijriDate | null {
    // Use the calendar date this instance displays rather than the raw instant.
    // this.year()/.month()/.date() respect utc mode automatically, so a moment
    // created with .utc() uses UTC components and a local moment uses local components.
    // moment.month() is 0-based, matching Date.UTC's month parameter exactly.
    return toHijri(new Date(Date.UTC(this.year(), this.month(), this.date())), opts);
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

  momentInstance.fn.formatHijri = function (formatStr: string, opts?: ConversionOptions): string {
    const hijri = this.toHijri(opts);
    if (!hijri) return "";
    const dow = this.day();
    // Replace Hijri tokens with escaped literals, then pass the residual string
    // to moment.format() so all standard tokens (YYYY, MMM, etc.) resolve correctly.
    // Escaping is required because values like "Ramadan" would otherwise be
    // interpreted by moment as format tokens (R, a, m, etc.).
    const residual = formatStr.replace(HIJRI_TOKEN_RE, (token: string): string => {
      switch (token) {
        case "iYYYY":
          return escapeLiteral(String(hijri.hy).padStart(4, "0"));
        case "iYY":
          return escapeLiteral(String(hijri.hy % 100).padStart(2, "0"));
        case "iMMMM":
          // Non-null: hijri.hm is 1-12; hm-1 is always 0-11, within hmLong bounds.
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return escapeLiteral(hmLong[hijri.hm - 1]!);
        case "iMMM":
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return escapeLiteral(hmMedium[hijri.hm - 1]!);
        case "iMM":
          return escapeLiteral(String(hijri.hm).padStart(2, "0"));
        case "iM":
          return escapeLiteral(String(hijri.hm));
        case "iDD":
          return escapeLiteral(String(hijri.hd).padStart(2, "0"));
        case "iD":
          return escapeLiteral(String(hijri.hd));
        case "iEEEE":
          // Non-null: dow is always 0-6 (day of week), within hwLong bounds.
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return escapeLiteral(hwLong[dow]!);
        case "iEEE":
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return escapeLiteral(hwShort[dow]!);
        case "iE":
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return escapeLiteral(String(hwNumeric[dow]!));
        // Era tokens: both iooo and ioooo map to the common abbreviation.
        case "iooo":
        case "ioooo":
          return escapeLiteral("AH");
        default:
          return token;
      }
    });
    return this.format(residual);
  };

  // Attach fromHijri as a property on the constructor. We use bracket notation and a type
  // assertion because MomentStatic augmentation produces a DTS visibility error with some
  // TypeScript configurations; attaching at runtime is equivalent and safe.
  (momentInstance as unknown as Record<string, unknown>)["fromHijri"] = function (
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
    // Construct from explicit year/month/day components so the moment displays
    // the correct calendar date regardless of the host timezone offset.
    return momentInstance([greg.getUTCFullYear(), greg.getUTCMonth(), greg.getUTCDate()]);
  };
}

export default install;
export type { HijriDate, ConversionOptions, CalendarEngine } from "hijri-core";
export { registerCalendar, getCalendar, listCalendars } from "hijri-core";

// ── Opt-in anonymous telemetry ────────────────────────────────────────────────
// Off by default. Enable: ACAMARATA_TELEMETRY=1
// What is sent + how to disable: https://github.com/acamarata/telemetry/blob/main/TELEMETRY.md
import("@acamarata/telemetry")
  .then(({ track }) => track("load", { package: "moment-hijri-plus", version: "1.0.4" }))
  .catch(() => {
    // telemetry not installed or disabled — that's fine
  });
