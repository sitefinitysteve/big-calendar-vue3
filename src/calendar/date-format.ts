import { format } from 'date-fns'

import type { Locale } from 'date-fns'

/**
 * Locale-derived date and time patterns.
 *
 * The calendar used to hardcode `'MMM d, yyyy'` and `'h:mm a'` at every call
 * site and pass a `Locale` alongside them. That only ever localised the *words*
 * — `format()` resolves `MMM` through `locale.localize.month`, but `d`, `y` and
 * `a` are locale-independent and the ORDER of the tokens is fixed by the
 * pattern string itself. So a French calendar rendered `déc. 1, 2026` (English
 * word order, French month name) and `2:30 PM` (French locales are 24-hour).
 * No `Locale` object could rescue that, because none of them get a say in the
 * pattern.
 *
 * Every date-fns locale already carries the answer in `formatLong`, which is
 * the same CLDR data `Intl.DateTimeFormat` uses. Reading the pattern from the
 * locale instead of hardcoding it is correct for every language at once, and
 * for `en-US` it resolves to the patterns that were hardcoded here anyway:
 *
 * | locale | medium date | short time |
 * | ------ | ----------- | ---------- |
 * | en-US  | `MMM d, y`  | `h:mm a`   |
 * | fr-CA  | `d MMM y`   | `HH:mm`    |
 * | ja     | `y/MM/dd`   | `H:mm`     |
 *
 * The `FALLBACK_*` constants below are the previously-hardcoded patterns, kept
 * verbatim so that a caller passing no locale — or a hand-rolled `Locale` with
 * no `formatLong` — renders exactly what this component rendered before.
 */

/** Previously hardcoded at every date call site. */
const FALLBACK_DATE = 'MMM d, yyyy'

/** Previously hardcoded in the agenda day header. */
const FALLBACK_LONG_DATE = 'EEEE, MMMM d, yyyy'

/** Previously hardcoded at every time call site. */
const FALLBACK_TIME = 'h:mm a'

/** Previously hardcoded on the day/week hour axis. */
const FALLBACK_HOUR = 'hh a'

/** date-fns `format()` options, or `undefined` when there is no locale. */
function opts(locale?: Locale) {
  return locale ? { locale } : undefined
}

/**
 * A pattern with its quoted literals removed, so token detection cannot be
 * fooled by a locale that spells its separator out — `ko` uses `a h:mm`, but a
 * locale is free to use `H'h'mm`, where the `h` is a literal letter and not an
 * hour token.
 */
function withoutLiterals(pattern: string): string {
  return pattern.replace(/'[^']*'/g, '')
}

/** Medium date: `MMM d, y` (en-US), `d MMM y` (fr-CA). */
export function datePattern(locale?: Locale): string {
  return locale?.formatLong?.date({ width: 'medium' }) ?? FALLBACK_DATE
}

/** Full date with weekday: `EEEE, MMMM do, y` (en-US), `EEEE d MMMM y` (fr-CA). */
export function longDatePattern(locale?: Locale): string {
  return locale?.formatLong?.date({ width: 'full' }) ?? FALLBACK_LONG_DATE
}

/** Short time: `h:mm a` (en-US), `HH:mm` (fr-CA). */
export function timePattern(locale?: Locale): string {
  return locale?.formatLong?.time({ width: 'short' }) ?? FALLBACK_TIME
}

/**
 * Hour only, for the day/week view's time axis.
 *
 * There is no CLDR "hour" pattern, so this is derived from the locale's own
 * time pattern: a 24-hour locale labels the axis `14`, a 12-hour one `02 PM`.
 * Deriving it rather than hardcoding is what keeps the axis consistent with the
 * event times printed beside it.
 */
/**
 * Whether the locale tells time on a 24-hour clock.
 *
 * Exported because the time INPUTS need the same answer the read-only labels
 * get — a French calendar that prints `14:30` but offers an AM/PM dropdown to
 * edit it is the same bug wearing a different hat.
 */
export function is24HourLocale(locale?: Locale): boolean {
  const time = locale?.formatLong?.time({ width: 'short' })

  return time ? /[Hk]/.test(withoutLiterals(time)) : false
}

export function hourPattern(locale?: Locale): string {
  const time = locale?.formatLong?.time({ width: 'short' })

  if (!time) {
    return FALLBACK_HOUR
  }

  const tokens = withoutLiterals(time)

  if (/[Hk]/.test(tokens)) {
    return 'HH'
  }

  // A 12-hour locale does not necessarily print a meridiem, and does not
  // necessarily print it last: `uz` is `h:mm` and `zh-CN` is `a h:mm`. Take
  // both facts from the locale rather than assuming the en-US shape.
  const hour = tokens.search(/[hK]/)
  const meridiem = tokens.indexOf('a')

  if (hour === -1) {
    return FALLBACK_HOUR
  }

  if (meridiem === -1) {
    return 'hh'
  }

  return meridiem < hour ? 'a hh' : 'hh a'
}

/**
 * Medium date plus short time, composed the way the locale joins them:
 * `MMM d, y, h:mm a` (en-US), `d MMM y, HH:mm` (fr-CA).
 */
export function dateTimePattern(locale?: Locale): string {
  const joiner = locale?.formatLong?.dateTime({ width: 'short' })

  if (!joiner) {
    return `${FALLBACK_DATE} ${FALLBACK_TIME}`
  }

  return joiner
    .replace('{{date}}', datePattern(locale))
    .replace('{{time}}', timePattern(locale))
}

/** `Dec 1, 2026` (en-US), `1 déc. 2026` (fr-CA). */
export function formatDate(date: Date, locale?: Locale): string {
  return format(date, datePattern(locale), opts(locale))
}

/** `Tuesday, December 1st, 2026` (en-US), `mardi 1 décembre 2026` (fr-CA). */
export function formatLongDate(date: Date, locale?: Locale): string {
  return format(date, longDatePattern(locale), opts(locale))
}

/** `2:30 PM` (en-US), `14:30` (fr-CA). */
export function formatTime(date: Date, locale?: Locale): string {
  return format(date, timePattern(locale), opts(locale))
}

/** `02 PM` (en-US), `14` (fr-CA). */
export function formatHour(date: Date, locale?: Locale): string {
  return format(date, hourPattern(locale), opts(locale))
}

/** `Dec 1, 2026, 2:30 PM` (en-US), `1 déc. 2026, 14:30` (fr-CA). */
export function formatDateTime(date: Date, locale?: Locale): string {
  return format(date, dateTimePattern(locale), opts(locale))
}
