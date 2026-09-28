/**
 * Calendar helpers shared by the server (dashboard payloads) and the client
 * (30-day strip). Everything works off local-time "YYYY-MM-DD" keys so SSR
 * and the browser agree on day boundaries regardless of timezone, and all
 * labels come from fixed arrays so server/client rendering never mismatch
 * the way toLocaleDateString can.
 */

export const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const WEEKDAY_SHORT = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

/** Local-time "YYYY-MM-DD" (avoids UTC off-by-one on date keys). */
export function dateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Parse "YYYY-MM-DD" as local midnight (never UTC, never off-by-one). */
export function parseDateKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year || 1970, (month || 1) - 1, day || 1);
}

export function addDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

export function addDaysToKey(key: string, days: number): string {
  return dateKey(addDays(parseDateKey(key), days));
}

/** "27 Oct" */
export function formatDayMonth(key: string): string {
  const date = parseDateKey(key);
  return `${date.getDate()} ${MONTH_SHORT[date.getMonth()]}`;
}

/** "Sun 12 Oct" */
export function formatWeekdayDate(key: string): string {
  const date = parseDateKey(key);
  return `${WEEKDAY_SHORT[date.getDay()]} ${date.getDate()} ${MONTH_SHORT[date.getMonth()]}`;
}

/** UTC midnight for a "YYYY-MM-DD"/ISO string, else null. */
export function utcDayMs(value: unknown): number | null {
  if (typeof value !== "string" || value.length < 10) return null;
  const ms = Date.parse(`${value.slice(0, 10)}T00:00:00Z`);
  return Number.isNaN(ms) ? null : ms;
}

/**
 * Program day for a calendar date. `anchorKey` is the program's day-1 date
 * (`started_at`) and `anchorDay` the day number that date corresponds to.
 */
export function dayNumberBetween(
  anchorKey: string,
  anchorDay: number,
  targetKey: string,
): number | null {
  const anchor = utcDayMs(anchorKey);
  const target = utcDayMs(targetKey);
  if (anchor == null || target == null) return null;

  return Math.floor((target - anchor) / 86_400_000) + anchorDay;
}
