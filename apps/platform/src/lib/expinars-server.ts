import type { LiveExpinar } from "@cdp/types";

import { createClient } from "@/lib/supabase/server";
import { formatExpinarDate, formatExpinarTime } from "@/lib/dashboard-format";
import {
  fallbackExpinars,
  GENERIC_JOIN_NOTE,
  type ExpinarEvent,
} from "@/lib/expinars";

/**
 * Server-side reads for the Expinars page — the only part that touches
 * Supabase. Any failure (unconfigured client, table/columns missing before
 * migration 0006) degrades to the code catalog so the page never renders
 * empty.
 */

interface ExpinarBaseRow {
  id: string;
  title: string;
  detail: string | null;
  join_note: string | null;
  speaker: string | null;
  speaker_role: string | null;
  starts_at: string;
}

interface ExpinarRow extends ExpinarBaseRow {
  duration_seconds: number | null;
  viewers: number | null;
  track: string | null;
  hint: string | null;
}

function mapRow(
  row: ExpinarBaseRow &
    Partial<Pick<ExpinarRow, "duration_seconds" | "viewers" | "track" | "hint">>,
): ExpinarEvent {
  return {
    id: row.id,
    title: row.title,
    detail: row.detail ?? "",
    joinNote: row.join_note || GENERIC_JOIN_NOTE,
    speaker: row.speaker ?? "Rarewise faculty",
    speakerRole: row.speaker_role ?? "",
    startsAt: row.starts_at,
    durationSeconds: row.duration_seconds ?? null,
    viewers: row.viewers ?? null,
    track: row.track ?? null,
    hint: row.hint ?? null,
  };
}

const EVENT_COLUMNS =
  "id, title, detail, join_note, speaker, speaker_role, starts_at, duration_seconds, viewers, track, hint";

/** Every session in the catalog, soonest first. */
export async function fetchExpinarEvents(): Promise<ExpinarEvent[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("expinar_events")
      .select(EVENT_COLUMNS)
      .order("starts_at", { ascending: true });

    if (error || !data || data.length === 0) {
      return fallbackExpinars();
    }

    return (data as ExpinarRow[]).map(mapRow);
  } catch {
    return fallbackExpinars();
  }
}

/**
 * One session shaped for the .ics endpoint. Selects only the 0001 columns
 * so it works before migration 0006 is applied. null when unknown.
 */
export async function getExpinarEventById(
  id: string,
): Promise<LiveExpinar | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("expinar_events")
      .select("id, title, detail, join_note, starts_at")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) return null;

    const row = data as Pick<
      ExpinarBaseRow,
      "id" | "title" | "detail" | "join_note" | "starts_at"
    >;
    const startsAt = new Date(row.starts_at);

    return {
      id: row.id,
      title: row.title,
      detail: row.detail ?? "",
      startsAt: row.starts_at,
      dateLabel: formatExpinarDate(startsAt),
      timeLabel: formatExpinarTime(startsAt),
      joinNote: row.join_note || GENERIC_JOIN_NOTE,
    };
  } catch {
    return null;
  }
}
