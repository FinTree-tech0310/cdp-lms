import type {
  MiniGameHub,
  MiniGameProgress,
  MiniGameProgressPayload,
  MiniGameResultInput,
} from "@cdp/types";

import { gamesMeta } from "@/lib/data/games";

/**
 * Shared client helpers for the /mini-games feature.
 *
 * The ported games keep their original per-scenario rotation in
 * localStorage (one key per game, untouched). This module adds the
 * cross-game layer: which games exist, a local mirror of run results so
 * the catalogue still shows progress when the API answers
 * `persisted: false` (demo mode / migration 0007 not applied yet), and
 * the fire-and-forget recorder every game calls when a run finishes.
 */

export const MINI_GAME_HUBS: readonly MiniGameHub[] = [
  "investment-banking-games",
  "equity-research-games",
  "private-wealth-games",
  "vc-games",
  "future-of-finance-games",
] as const;

/** localStorage mirror of finished runs — the offline source of truth. */
export const MINI_GAMES_MIRROR_KEY = "cdp:mini-games:progress:v1";

const GAME_ID_RE = /^[a-z0-9][a-z0-9-]{0,63}$/;

export function isMiniGameHub(value: string): value is MiniGameHub {
  return (MINI_GAME_HUBS as readonly string[]).includes(value);
}

/** True when hub + slug name one of the 26 ported games. */
export function isMiniGameRef(hub: string, gameId: string): boolean {
  if (!isMiniGameHub(hub) || !GAME_ID_RE.test(gameId)) return false;
  return gamesMeta.some(
    (game) => game.href === `/mini-games/${hub}/${gameId}`,
  );
}

export function progressKey(hub: string, gameId: string): string {
  return `${hub}/${gameId}`;
}

/* ---------------- local mirror ---------------- */

function clampInt(value: unknown, min: number, max: number): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return Math.min(max, Math.max(min, Math.round(value)));
}

function parseProgress(value: unknown): MiniGameProgress | null {
  if (typeof value !== "object" || value === null) return null;
  const row = value as Record<string, unknown>;

  const hub = typeof row.hub === "string" ? row.hub : "";
  const gameId = typeof row.gameId === "string" ? row.gameId : "";
  if (!isMiniGameRef(hub, gameId)) return null;

  return {
    hub: hub as MiniGameHub,
    gameId,
    plays: clampInt(row.plays, 0, 1_000_000) ?? 0,
    bestScore: clampInt(row.bestScore, -1_000_000, 1_000_000),
    lastScore: clampInt(row.lastScore, -1_000_000, 1_000_000),
    lastOutcome:
      typeof row.lastOutcome === "string" && row.lastOutcome.length <= 80
        ? row.lastOutcome
        : null,
    bestStreak: clampInt(row.bestStreak, 0, 1_000_000),
    completedRuns: clampInt(row.completedRuns, 0, 1_000_000) ?? 0,
    firstPlayedAt:
      typeof row.firstPlayedAt === "string" ? row.firstPlayedAt : null,
    lastPlayedAt:
      typeof row.lastPlayedAt === "string" ? row.lastPlayedAt : null,
  };
}

/** Schema-validated read of the local mirror (never throws). */
export function readLocalMiniGameProgress(): MiniGameProgress[] {
  try {
    if (typeof window === "undefined") return [];
    const raw = window.localStorage.getItem(MINI_GAMES_MIRROR_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const seen = new Set<string>();
    const items: MiniGameProgress[] = [];

    for (const entry of parsed) {
      const item = parseProgress(entry);
      if (!item) continue;
      const key = progressKey(item.hub, item.gameId);
      if (seen.has(key)) continue;
      seen.add(key);
      items.push(item);
    }

    return items;
  } catch {
    // Storage is optional; the catalogue works without it.
    return [];
  }
}

function applyToMirror(result: MiniGameResultInput): MiniGameProgress[] {
  const items = readLocalMiniGameProgress();
  const key = progressKey(result.hub, result.gameId);
  const now = new Date().toISOString();
  const existing = items.find(
    (item) => progressKey(item.hub, item.gameId) === key,
  );

  const score = clampInt(result.score, -1_000_000, 1_000_000);
  const streak = clampInt(result.streak, 0, 1_000_000);
  const next: MiniGameProgress = {
    hub: result.hub,
    gameId: result.gameId,
    plays: (existing?.plays ?? 0) + 1,
    bestScore:
      score == null
        ? (existing?.bestScore ?? null)
        : Math.max(existing?.bestScore ?? score, score),
    lastScore: score ?? (existing?.lastScore ?? null),
    lastOutcome:
      (typeof result.outcome === "string" && result.outcome.length <= 80
        ? result.outcome
        : null) ?? (existing?.lastOutcome ?? null),
    bestStreak:
      streak == null
        ? (existing?.bestStreak ?? null)
        : Math.max(existing?.bestStreak ?? streak, streak),
    completedRuns:
      (existing?.completedRuns ?? 0) + (result.completed === false ? 0 : 1),
    firstPlayedAt: existing?.firstPlayedAt ?? now,
    lastPlayedAt: now,
  };

  const merged = [...items.filter((item) => progressKey(item.hub, item.gameId) !== key), next];

  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(MINI_GAMES_MIRROR_KEY, JSON.stringify(merged));
    }
  } catch {
    // Storage is optional; the game remains playable without it.
  }

  return merged;
}

/**
 * Union of server rows and the local mirror, keyed per game. When both
 * know a game the row with more plays wins — never summed — so a run
 * that reached both sides is counted once.
 */
export function mergeMiniGameProgress(
  server: MiniGameProgress[],
  local: MiniGameProgress[],
): MiniGameProgress[] {
  const merged = new Map<string, MiniGameProgress>();

  for (const item of [...server, ...local]) {
    const key = progressKey(item.hub, item.gameId);
    const current = merged.get(key);
    if (!current || item.plays > current.plays) merged.set(key, item);
  }

  return [...merged.values()];
}

/* ---------------- API ---------------- */

/** Finished-run recorder: mirrors locally, then syncs — failures ignored. */
export async function recordMiniGameResult(
  result: MiniGameResultInput,
): Promise<void> {
  applyToMirror(result);

  try {
    await fetch("/api/mini-games/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result),
      keepalive: true,
    });
  } catch {
    // Offline or demo mode: the mirror already holds the run.
  }
}

/** Server rows, falling back to the local mirror when unavailable. */
export async function fetchMiniGameProgress(): Promise<MiniGameProgressPayload> {
  try {
    const response = await fetch("/api/mini-games/progress", {
      cache: "no-store",
    });
    if (!response.ok) throw new Error(String(response.status));
    const payload = (await response.json()) as MiniGameProgressPayload;
    return {
      persisted: Boolean(payload.persisted),
      items: Array.isArray(payload.items) ? payload.items : [],
    };
  } catch {
    return { persisted: false, items: [] };
  }
}
