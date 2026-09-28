import type { LiveExpinar } from "@cdp/types";

import { formatExpinarDate, formatExpinarTime } from "@/lib/dashboard-format";

/**
 * Expinars page data — session catalog shape + phase math. Pure module
 * (no Supabase, no server APIs) so the client board, cards and dialog can
 * share it. The database read lives in lib/expinars-server.ts.
 *
 * Phases (live / upcoming / recorded) are derived from starts_at +
 * duration on every read, so the page rolls forward with no status column
 * to maintain.
 */

export type ExpinarPhase = "live" | "upcoming" | "recorded";

export interface ExpinarEvent {
  id: string;
  title: string;
  detail: string;
  joinNote: string;
  speaker: string;
  speakerRole: string;
  /** ISO timestamp. */
  startsAt: string;
  /** null → no recording duration chip; still lists as recorded once past. */
  durationSeconds: number | null;
  /** Live-session audience count (catalog display only). */
  viewers: number | null;
  track: string | null;
  /** "Best after Module 3"-style study hint, recorded sessions only. */
  hint: string | null;
}

export const GENERIC_JOIN_NOTE =
  "The join link opens 10 minutes before the start.";

/* ------------------------------------------------------------ phase math */

export function expinarPhase(
  event: ExpinarEvent,
  nowMs: number,
): ExpinarPhase {
  const start = Date.parse(event.startsAt);
  if (Number.isNaN(start)) return "upcoming";
  if (nowMs < start) return "upcoming";

  const end = start + (event.durationSeconds ?? 0) * 1000;
  if (event.durationSeconds != null && nowMs < end) return "live";

  return "recorded";
}

/** "Starts in 2d 6h" / "Starts in 45m" — ticks with the caller's clock. */
export function relativeStart(startsAt: string, nowMs: number): string {
  const diff = Date.parse(startsAt) - nowMs;
  if (diff <= 0) return "Starting now";

  const minutes = Math.round(diff / 60_000);
  if (minutes < 60) return `Starts in ${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Starts in ${hours}h ${minutes % 60}m`;

  const days = Math.floor(hours / 24);
  return `Starts in ${days}d ${hours % 24}h`;
}

/** "Ends in 34m" for a live session. */
export function endsIn(
  startsAt: string,
  durationSeconds: number | null,
  nowMs: number,
): string | null {
  if (durationSeconds == null) return null;
  const end = Date.parse(startsAt) + durationSeconds * 1000;
  const diff = end - nowMs;
  if (diff <= 0) return null;

  const minutes = Math.ceil(diff / 60_000);
  if (minutes < 60) return `Ends in ${minutes}m`;
  return `Ends in ${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

/** The .ics download for one session (falls back to the next upcoming). */
export function expinarIcsHref(id?: string): string {
  return id
    ? `/api/expinar/calendar?id=${encodeURIComponent(id)}`
    : "/api/expinar/calendar";
}

/** Adapt a session to the shape the shared AddToCalendar dropdown expects. */
export function toLiveExpinar(event: ExpinarEvent): LiveExpinar {
  const start = new Date(event.startsAt);

  return {
    id: event.id,
    title: event.title,
    detail: event.detail,
    startsAt: event.startsAt,
    dateLabel: formatExpinarDate(start),
    timeLabel: formatExpinarTime(start),
    joinNote: event.joinNote,
  };
}

/* -------------------------------------------------------------- formatting */

const cardDateFmt = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

/** "Sat, 26 Sep" — comma after the weekday, card meta style. */
export function formatCardDate(date: Date): string {
  const values: Record<string, string> = {};

  for (const part of cardDateFmt.formatToParts(date)) {
    if (part.type !== "literal") {
      values[part.type] = part.value;
    }
  }

  return [values.weekday ? `${values.weekday},` : "", values.day, values.month]
    .filter(Boolean)
    .join(" ");
}

/* --------------------------------------------------------------- fallback */

/** Next occurrence of a weekday at a local hour, strictly after `from`. */
function nextWeekday(from: Date, weekday: number, hour: number): Date {
  const d = new Date(from);
  d.setHours(hour, 0, 0, 0);
  const delta = (weekday - d.getDay() + 7) % 7;
  d.setDate(d.getDate() + delta);
  if (d.getTime() <= from.getTime()) d.setDate(d.getDate() + 7);
  return d;
}

function daysAgo(from: Date, days: number, hour: number): Date {
  const d = new Date(from);
  d.setDate(d.getDate() - days);
  d.setHours(hour, 0, 0, 0);
  return d;
}

function iso(date: Date): string {
  return date.toISOString();
}

/**
 * The shared catalog with dates computed from `now` — mirrors the 0006
 * seed one-for-one (same ids, titles, speakers, durations) so switching
 * from fallback to database is seamless. Used when Supabase is
 * unconfigured, the table is empty, or migration 0006 hasn't run yet.
 */
export function fallbackExpinars(now: Date = new Date()): ExpinarEvent[] {
  const liveStart = new Date(now.getTime() - 20 * 60_000);
  const saturday = nextWeekday(now, 6, 18);
  const saturdayLate = new Date(saturday);
  saturdayLate.setDate(saturdayLate.getDate() + 14);
  saturdayLate.setHours(11, 0, 0, 0);

  return [
    {
      id: "exp-ipo-live",
      title: "How an IPO Comes Together",
      detail:
        "From filing to first trade: how the book gets built, who signs off at each step, and where the analyst sits through it all.",
      joinNote: GENERIC_JOIN_NOTE,
      speaker: "Meera Iyer",
      speakerRole: "Director, Capital Markets",
      startsAt: iso(liveStart),
      durationSeconds: 3600,
      viewers: 142,
      track: "Investment Banking",
      hint: null,
    },
    {
      id: "exp-mna-deal",
      title: "Inside a Live M&A Deal",
      detail:
        "A deal team walks through a live mandate — teasers, diligence, valuation debates and the weekend the term sheet lands.",
      joinNote: GENERIC_JOIN_NOTE,
      speaker: "Rohan Malhotra",
      speakerRole: "Vice President, M&A Advisory",
      startsAt: iso(saturday),
      durationSeconds: 3600,
      viewers: null,
      track: "Investment Banking",
      hint: null,
    },
    {
      id: "exp-bank-boutique",
      title: "Global Bank or Boutique?",
      detail:
        "Two bankers compare life at a bulge-bracket desk and a specialist shop — deal sizes, learning curves and exit options.",
      joinNote: GENERIC_JOIN_NOTE,
      speaker: "Sana Qureshi",
      speakerRole: "Associate, Advisory Firm",
      startsAt: iso(saturdayLate),
      durationSeconds: 3600,
      viewers: null,
      track: "Investment Banking",
      hint: null,
    },
    {
      id: "exp-er-desk",
      title: "A day on an equity research desk",
      detail:
        "Senior Analyst, equity research. Bring your questions from modules 1 to 3.",
      joinNote: GENERIC_JOIN_NOTE,
      speaker: "Senior Analyst",
      speakerRole: "Equity Research",
      startsAt: iso(nextWeekday(now, 4, 19)),
      durationSeconds: 3600,
      viewers: null,
      track: "Equity Research",
      hint: null,
    },
    {
      id: "exp-first-year",
      title: "My First Year as an IB Analyst",
      detail:
        "An honest walk through year one: the work that actually lands on your desk, the hours, and what nobody tells you before you start.",
      joinNote: GENERIC_JOIN_NOTE,
      speaker: "Ishita Banerjee",
      speakerRole: "Analyst, Investment Banking",
      startsAt: iso(daysAgo(now, 14, 10)),
      durationSeconds: 3130,
      viewers: null,
      track: "Investment Banking",
      hint: "Best after Module 3",
    },
    {
      id: "exp-ai-work",
      title: "How AI Is Changing Analyst Work",
      detail:
        "Where models already touch the analyst workflow — and the skills that matter more because of it.",
      joinNote: GENERIC_JOIN_NOTE,
      speaker: "Vikram Sethi",
      speakerRole: "Vice President, Investment Banking",
      startsAt: iso(daysAgo(now, 9, 10)),
      durationSeconds: 2855,
      viewers: null,
      track: "Investment Banking",
      hint: "Best after Module 11",
    },
    {
      id: "exp-myths",
      title: "Myths About Investment Banking",
      detail:
        "Seven career myths, taken one by one, from people who lived through them.",
      joinNote: GENERIC_JOIN_NOTE,
      speaker: "Ananya Rao",
      speakerRole: "Director, Investment Banking",
      startsAt: iso(daysAgo(now, 5, 10)),
      durationSeconds: 2300,
      viewers: null,
      track: "Investment Banking",
      hint: null,
    },
  ];
}
