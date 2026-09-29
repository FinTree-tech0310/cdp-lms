import { NextResponse, type NextRequest } from "next/server";

import {
  isMiniGameHub,
  isMiniGameRef,
  progressKey,
} from "@/lib/mini-games";
import { getMiniGameProgress, mapProgressRow } from "@/lib/mini-games-server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";

/**
 * /api/mini-games/progress — results for the 26 mini-games.
 *
 *   GET  → every stored run-summary for this user (drives the /mini-games
 *          catalogue cards and header stats).
 *   POST → one finished run: bump plays, fold the score/streak into the
 *          best-of columns, remember the last authored ending.
 *
 * Migration 0007 creates public.mini_game_progress. Until it is applied
 * every call answers `persisted: false` and the client keeps its local
 * mirror — the same graceful-degradation contract /api/progress uses.
 */

interface ProgressBody {
  hub?: unknown;
  gameId?: unknown;
  score?: unknown;
  outcome?: unknown;
  streak?: unknown;
  completed?: unknown;
}

/** One stored row when reading the pre-upsert state. */
interface StoredRow {
  hub: string;
  game_id: string;
  plays: number;
  best_score: number | null;
  last_score: number | null;
  last_outcome: string | null;
  best_streak: number | null;
  completed_runs: number;
  first_played_at: string | null;
}

const GAME_ID_RE = /^[a-z0-9][a-z0-9-]{0,63}$/;
const MAX_SCORE = 1_000_000;

function unauthorised() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function asInt(
  value: unknown,
  min: number,
  max: number,
): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return Math.min(max, Math.max(min, Math.round(value)));
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return unauthorised();

  return NextResponse.json(await getMiniGameProgress(user.id));
}

export async function POST(request: NextRequest) {
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

  const hub = typeof body.hub === "string" ? body.hub : "";
  const gameId = typeof body.gameId === "string" ? body.gameId : "";

  if (!isMiniGameHub(hub)) {
    return NextResponse.json({ error: "Unknown hub" }, { status: 400 });
  }

  if (!GAME_ID_RE.test(gameId) || !isMiniGameRef(hub, gameId)) {
    return NextResponse.json(
      { error: "No such mini-game" },
      { status: 404 },
    );
  }

  const score = asInt(body.score, -MAX_SCORE, MAX_SCORE);
  const streak = asInt(body.streak, 0, MAX_SCORE);
  const outcome =
    typeof body.outcome === "string" && body.outcome.length > 0
      ? body.outcome.slice(0, 80)
      : null;
  const completed = typeof body.completed === "boolean" ? body.completed : true;

  // Demo mode: acknowledge without persisting (no database configured).
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      ok: true,
      persisted: false,
      hub,
      gameId,
      score,
      outcome,
    });
  }

  const existingRes = await supabase
    .from("mini_game_progress")
    .select(
      "hub, game_id, plays, best_score, last_score, last_outcome, best_streak, completed_runs, first_played_at",
    )
    .eq("user_id", user.id)
    .eq("hub", hub)
    .eq("game_id", gameId)
    .maybeSingle();

  if (existingRes.error) {
    // Migration 0007 not applied yet — local mirror stays authoritative.
    console.warn("[mini-games] read failed:", existingRes.error.message);
    return NextResponse.json({
      ok: false,
      persisted: false,
      hub,
      gameId,
      reason: existingRes.error.message,
    });
  }

  const existing = (existingRes.data ?? null) as StoredRow | null;
  const now = new Date().toISOString();

  const row = {
    user_id: user.id,
    hub,
    game_id: gameId,
    plays: (existing?.plays ?? 0) + 1,
    best_score:
      score == null
        ? (existing?.best_score ?? null)
        : Math.max(existing?.best_score ?? score, score),
    last_score: score ?? (existing?.last_score ?? null),
    last_outcome: outcome ?? (existing?.last_outcome ?? null),
    best_streak:
      streak == null
        ? (existing?.best_streak ?? null)
        : Math.max(existing?.best_streak ?? streak, streak),
    completed_runs: (existing?.completed_runs ?? 0) + (completed ? 1 : 0),
    first_played_at: existing?.first_played_at ?? now,
    last_played_at: now,
    updated_at: now,
  };

  const { error: upsertError } = await supabase
    .from("mini_game_progress")
    .upsert(row, { onConflict: "user_id,hub,game_id" });

  if (upsertError) {
    console.warn("[mini-games] save failed:", upsertError.message);
    return NextResponse.json(
      { error: `Failed to save result: ${upsertError.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    persisted: true,
    key: progressKey(hub, gameId),
    item: mapProgressRow({
      hub,
      game_id: gameId,
      plays: row.plays,
      best_score: row.best_score,
      last_score: row.last_score,
      last_outcome: row.last_outcome,
      best_streak: row.best_streak,
      completed_runs: row.completed_runs,
      first_played_at: row.first_played_at,
      last_played_at: row.last_played_at,
    }),
  });
}
