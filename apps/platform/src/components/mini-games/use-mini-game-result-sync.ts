"use client";

import type { MiniGameResultInput } from "@cdp/types";
import { usePathname } from "next/navigation";
import { useCallback, useRef } from "react";

import { isMiniGameHub, recordMiniGameResult } from "@/lib/mini-games";

/** A finished run, minus the ids — those come from the URL. */
export type MiniGameRunResult = Omit<MiniGameResultInput, "hub" | "gameId">;

/**
 * Reports a finished mini-game run to the backend.
 *
 * The hub and game id are derived from the pathname
 * (`/mini-games/<hub>/<slug>`), so games only pass their result:
 *
 *   const syncResult = useMiniGameResultSync();
 *   useEffect(() => { if (state.phase === "results") syncResult({ score, outcome }); }, [state.phase]);
 *
 * Identical payloads within a short window count once — React strict
 * mode runs effects twice in dev, and a run must not double-bill plays.
 * Failures are swallowed: the result is already mirrored locally by
 * recordMiniGameResult.
 */
export function useMiniGameResultSync(): (result: MiniGameRunResult) => void {
  const pathname = usePathname();
  const lastRef = useRef<{ key: string; at: number } | null>(null);

  return useCallback(
    (result: MiniGameRunResult) => {
      const segments = pathname.split("/").filter(Boolean);
      if (segments[0] !== "mini-games") return;

      const hub = segments[1] ?? "";
      const gameId = segments[2] ?? "";
      if (!isMiniGameHub(hub) || gameId.length === 0) return;

      const outcome = result.outcome ?? "";
      const score = result.score ?? "";
      const streak = result.streak ?? "";
      const key = `${hub}/${gameId}|${outcome}|${score}|${streak}`;

      const now = Date.now();
      const last = lastRef.current;
      if (last && last.key === key && now - last.at < 1_500) return;
      lastRef.current = { key, at: now };

      void recordMiniGameResult({
        hub,
        gameId,
        ...result,
      } satisfies MiniGameResultInput);
    },
    [pathname],
  );
}
