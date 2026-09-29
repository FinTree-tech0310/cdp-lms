import type { MiniGameProgress, MiniGameProgressPayload } from "@cdp/types";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";

/**
 * Server-side reads for mini-games progress — the only part that touches
 * Supabase. Any failure (unconfigured client, table missing before
 * migration 0007) degrades to `persisted: false` with no rows; the client
 * then keeps its local mirror authoritative, the same graceful-degradation
 * contract /api/progress uses.
 */

interface ProgressRow {
  hub: string;
  game_id: string;
  plays: number;
  best_score: number | null;
  last_score: number | null;
  last_outcome: string | null;
  best_streak: number | null;
  completed_runs: number;
  first_played_at: string | null;
  last_played_at: string | null;
}

const ROW_COLUMNS =
  "hub, game_id, plays, best_score, last_score, last_outcome, best_streak, completed_runs, first_played_at, last_played_at";

export function mapProgressRow(row: ProgressRow): MiniGameProgress {
  return {
    hub: row.hub as MiniGameProgress["hub"],
    gameId: row.game_id,
    plays: row.plays ?? 0,
    bestScore: row.best_score ?? null,
    lastScore: row.last_score ?? null,
    lastOutcome: row.last_outcome ?? null,
    bestStreak: row.best_streak ?? null,
    completedRuns: row.completed_runs ?? 0,
    firstPlayedAt: row.first_played_at ?? null,
    lastPlayedAt: row.last_played_at ?? null,
  };
}

/** Every stored run-summary for this user, most recently played first. */
export async function getMiniGameProgress(
  userId: string,
): Promise<MiniGameProgressPayload> {
  if (!isSupabaseConfigured()) return { persisted: false, items: [] };

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("mini_game_progress")
      .select(ROW_COLUMNS)
      .eq("user_id", userId)
      .order("last_played_at", { ascending: false });

    if (error || !data) {
      // Migration 0007 not applied yet — local mirror stays authoritative.
      console.warn("[mini-games] read failed:", error?.message ?? "no data");
      return { persisted: false, items: [] };
    }

    return { persisted: true, items: (data as ProgressRow[]).map(mapProgressRow) };
  } catch (error) {
    console.warn(
      "[mini-games] read failed:",
      error instanceof Error ? error.message : error,
    );
    return { persisted: false, items: [] };
  }
}
