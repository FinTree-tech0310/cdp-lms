import { NextResponse, type NextRequest } from "next/server";

import {
  completedSectionCount,
  findCurriculumItem,
  getCurriculum,
  isSectionComplete,
  progressFromRows,
} from "@/lib/career-curriculum";
import { careerIdForTrack } from "@/lib/career-tracks";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";

/**
 * /api/careers/[careerId]/progress — syllabus progress for the careers page.
 *
 *   GET  → every stored item decision for this career (rows override the
 *          syllabus defaults, so "not watched" survives too).
 *   POST → flip one lecture/quiz, credit its runtime to learning_activity
 *          once, and keep the dashboard's track counters in step.
 *
 * Migration 0004 creates public.career_progress. Until it is applied every
 * call answers `persisted: false` and the client keeps its local cache —
 * the same graceful-degradation contract /api/progress uses.
 */

interface RouteContext {
  params: Promise<{ careerId: string }>;
}

interface ProgressBody {
  itemId?: unknown;
  completed?: unknown;
  activityDate?: unknown;
}

/** Shape of the career_progress rows this route reads. */
interface StoredRow {
  item_id: string;
  completed: boolean;
  credited_seconds?: number;
  completed_at?: string | null;
}

const CAREER_ID_RE = /^[a-z0-9-]+$/;
const ACTIVITY_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
/** One lecture credit, capped so a bad client can't flood the clock. */
const MAX_CREDIT_SECONDS = 60 * 30;

/** Local-time "YYYY-MM-DD" for the server (fallback when the client omits it). */
function serverDateKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function unauthorised() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { careerId } = await params;

  if (!CAREER_ID_RE.test(careerId)) {
    return NextResponse.json({ error: "Unknown career" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return unauthorised();

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ persisted: false, items: [] });
  }

  const { data, error } = await supabase
    .from("career_progress")
    .select("item_id, section_id, item_kind, completed")
    .eq("user_id", user.id)
    .eq("career_id", careerId);

  if (error) {
    // Migration 0004 not applied yet — local cache stays authoritative.
    console.warn("[career-progress] read failed:", error.message);
    return NextResponse.json({ persisted: false, items: [], reason: error.message });
  }

  return NextResponse.json({ persisted: true, items: data ?? [] });
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  const { careerId } = await params;

  if (!CAREER_ID_RE.test(careerId)) {
    return NextResponse.json({ error: "Unknown career" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return unauthorised();

  let body: ProgressBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const itemId = typeof body.itemId === "string" ? body.itemId.trim() : "";
  const completed = typeof body.completed === "boolean" ? body.completed : null;

  if (!itemId || completed === null) {
    return NextResponse.json(
      { error: "itemId and completed are required" },
      { status: 400 },
    );
  }

  const curriculum = getCurriculum(careerId);
  const item = curriculum ? findCurriculumItem(curriculum, itemId) : null;

  if (!curriculum || !item) {
    return NextResponse.json(
      { error: "No such item in this career's syllabus" },
      { status: 404 },
    );
  }

  // Demo mode: acknowledge without persisting (no database configured).
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, persisted: false, itemId, completed });
  }

  const activityDate =
    typeof body.activityDate === "string" &&
    ACTIVITY_DATE_RE.test(body.activityDate)
      ? body.activityDate
      : serverDateKey();

  const rowsRes = await supabase
    .from("career_progress")
    .select("item_id, completed, credited_seconds, completed_at")
    .eq("user_id", user.id)
    .eq("career_id", careerId);

  if (rowsRes.error) {
    console.warn("[career-progress] read failed:", rowsRes.error.message);
    return NextResponse.json({
      ok: false,
      persisted: false,
      itemId,
      completed,
      reason: rowsRes.error.message,
    });
  }

  const rows = (rowsRes.data ?? []) as StoredRow[];
  const existing = rows.find((row) => row.item_id === itemId);

  // Credit a lecture's runtime the first time it is marked watched.
  const creditedSeconds =
    item.kind === "lecture" &&
    completed &&
    (existing?.credited_seconds ?? 0) <= 0
      ? Math.min(item.durationSeconds, MAX_CREDIT_SECONDS)
      : 0;

  const { error: upsertError } = await supabase.from("career_progress").upsert(
    {
      user_id: user.id,
      career_id: careerId,
      section_id: item.sectionId,
      item_id: itemId,
      item_kind: item.kind,
      completed,
      credited_seconds: Math.max(existing?.credited_seconds ?? 0, creditedSeconds),
      completed_at: completed
        ? (existing?.completed_at ?? new Date().toISOString())
        : null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,career_id,item_id" },
  );

  if (upsertError) {
    return NextResponse.json(
      { error: `Failed to save progress: ${upsertError.message}` },
      { status: 500 },
    );
  }

  const toRows = (source: typeof rows) =>
    source.map((row) => ({ item_id: row.item_id, completed: row.completed }));

  const before = progressFromRows(curriculum, toRows(rows));
  const after = progressFromRows(curriculum, [
    ...toRows(rows.filter((row) => row.item_id !== itemId)),
    { item_id: itemId, completed },
  ]);

  const section = curriculum.sections.find((entry) => entry.id === item.sectionId);
  const sectionJustCompleted =
    section != null &&
    isSectionComplete(section, after[section.id]) &&
    !isSectionComplete(section, before[section.id]);

  // Today's learning minutes (streak + charts). Non-fatal: migration 0003
  // may be missing, and a watch must never fail over it. Un-marking does
  // not claw time back — credited_seconds keeps the total honest.
  let activityRecorded = false;

  if (creditedSeconds > 0 || sectionJustCompleted) {
    const { error: activityError } = await supabase.rpc(
      "record_learning_activity",
      {
        p_activity_date: activityDate,
        p_learned_seconds: creditedSeconds,
        p_module_completed: sectionJustCompleted,
      },
    );

    if (activityError) {
      console.warn("[career-progress] activity failed:", activityError.message);
    } else {
      activityRecorded = true;
    }
  }

  // Dashboard "N quizzes done" counts quiz_attempts — take the syllabus
  // quiz into that same ledger (one attempt row per syllabus quiz).
  let quizRecorded = false;

  if (item.kind === "quiz" && completed) {
    const existingAttempt = await supabase
      .from("quiz_attempts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("quiz_id", itemId);

    if (!existingAttempt.error && (existingAttempt.count ?? 0) === 0) {
      const { error: quizError } = await supabase
        .from("quiz_attempts")
        .insert({ user_id: user.id, quiz_id: itemId, passed: true });

      if (quizError) {
        console.warn("[career-progress] quiz attempt failed:", quizError.message);
      } else {
        quizRecorded = true;
      }
    }
  }

  // Keep public.track_progress in step so the dashboard's "Your tracks"
  // reads the same numbers as this syllabus.
  const trackId = careerIdForTrack(careerId);
  let trackCompletedModules: number | null = null;

  if (trackId) {
    const completedSections = completedSectionCount(curriculum, after);
    const existingTrack = await supabase
      .from("track_progress")
      .select("status")
      .eq("user_id", user.id)
      .eq("track_id", trackId)
      .maybeSingle();

    // Never silently unlock a day-gated track; everything else that has
    // syllabus progress reads as "In progress".
    const status =
      existingTrack.data?.status === "locked"
        ? "locked"
        : completedSections > 0
          ? "in_progress"
          : (existingTrack.data?.status ?? "started");

    const { error: trackError } = await supabase.from("track_progress").upsert(
      {
        user_id: user.id,
        track_id: trackId,
        status,
        completed_modules: completedSections,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,track_id" },
    );

    if (trackError) {
      console.warn("[career-progress] track sync failed:", trackError.message);
    } else {
      trackCompletedModules = completedSections;
    }
  }

  return NextResponse.json({
    ok: true,
    persisted: true,
    itemId,
    completed,
    creditedSeconds,
    activityRecorded,
    quizRecorded,
    sectionComplete:
      section != null && isSectionComplete(section, after[section.id]),
    trackCompletedModules,
  });
}
