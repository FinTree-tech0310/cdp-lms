"use client";

import type {
  MiniGameProgress,
  MiniGameProgressPayload,
} from "@cdp/types";
import Link from "next/link";
import { MiniGameCardLink } from "./MiniGameCardLink";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Gamepad2, Layers, RotateCcw } from "lucide-react";

import { gamesMeta, type GameMeta } from "@/lib/data/games";
import {
  mergeMiniGameProgress,
  progressKey,
  readLocalMiniGameProgress,
} from "@/lib/mini-games";
import { cn } from "@/lib/utils";

/**
 * The /mini-games catalogue: hub filter pills + a card for each of the
 * 26 ported mini-games, decorated with this user's stored runs.
 *
 * Server rows arrive via `initialProgress`; when the backend answered
 * `persisted: false` (demo mode / migration 0007 missing) the local
 * mirror is merged in so progress still shows on this device.
 */

interface HubMeta {
  slug: string;
  label: string;
  accent: string;
  accentBg: string;
}

const HUBS: readonly HubMeta[] = [
  {
    slug: "investment-banking-games",
    label: "Investment Banking",
    accent: "#1ed2f4",
    accentBg: "#eef0fe",
  },
  {
    slug: "equity-research-games",
    label: "Equity Research",
    accent: "#03795d",
    accentBg: "#ecfdf5",
  },
  {
    slug: "private-wealth-games",
    label: "Private Wealth",
    accent: "#8b5cf6",
    accentBg: "#f5f3ff",
  },
  {
    slug: "vc-games",
    label: "Venture Capitalist",
    accent: "#f97316",
    accentBg: "#fff7ed",
  },
  {
    slug: "future-of-finance-games",
    label: "Future of Finance",
    accent: "#0ea5e9",
    accentBg: "#f0f9ff",
  },
] as const;

type HubFilter = "all" | (typeof HUBS)[number]["slug"];

interface CatalogueGame {
  game: GameMeta;
  hub: HubMeta;
  slug: string;
}

function hubFor(game: GameMeta): CatalogueGame | null {
  // hrefs are "/mini-games/<hub>/<slug>" — one source of truth.
  const parts = game.href.split("/").filter(Boolean);
  if (parts[0] !== "mini-games" || !parts[1] || !parts[2]) return null;
  const hub = HUBS.find((entry) => entry.slug === parts[1]);
  if (!hub) return null;
  return { game, hub, slug: parts[2] };
}

function bestLabel(item: MiniGameProgress | undefined): string | null {
  if (!item || item.plays === 0) return null;
  if (item.bestScore != null) return `best ${item.bestScore}`;
  if (item.bestStreak != null) return `streak ${item.bestStreak}`;
  if (item.lastOutcome) return item.lastOutcome.replace(/-/g, " ");
  return null;
}

interface MiniGamesBoardProps {
  initialProgress: MiniGameProgressPayload;
}

export function MiniGamesBoard({ initialProgress }: MiniGamesBoardProps) {
  const [filter, setFilter] = useState<HubFilter>("all");
  const [items, setItems] = useState<MiniGameProgress[]>(
    initialProgress.items,
  );

  // Server rows first, then the local mirror (demo mode / offline).
  useEffect(() => {
    const local = readLocalMiniGameProgress();
    setItems(mergeMiniGameProgress(initialProgress.items, local));
  }, [initialProgress]);

  const progressByGame = useMemo(() => {
    const map = new Map<string, MiniGameProgress>();
    for (const item of items) {
      map.set(progressKey(item.hub, item.gameId), item);
    }
    return map;
  }, [items]);

  const catalogue = useMemo(
    () => gamesMeta.map(hubFor).filter((entry): entry is CatalogueGame => entry !== null),
    [],
  );

  const visible = useMemo(
    () =>
      filter === "all"
        ? catalogue
        : catalogue.filter((entry) => entry.hub.slug === filter),
    [catalogue, filter],
  );

  const stats = useMemo(() => {
    const played = items.filter((item) => item.plays > 0);
    return {
      gamesPlayed: played.length,
      totalGames: catalogue.length,
      totalPlays: played.reduce((sum, item) => sum + item.plays, 0),
    };
  }, [items, catalogue.length]);

  const activeHub = filter === "all" ? null : HUBS.find((h) => h.slug === filter);

  return (
    <div className="mini-games-catalog animate-rise-in mx-auto max-w-6xl px-4 py-6 sm:px-7 sm:py-8 lg:px-10 lg:py-10">
      {/* Header */}
      <header>
        <span className="inline-block rounded-md bg-[#f8dc03] px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#0e0e0e]">
          Practice
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-[0.01em] text-[#0e0e0e] sm:text-4xl lg:text-[42px] lg:leading-[1.05]">
          Learn by playing.
        </h1>
        <div className="mt-3 h-[3px] w-12 rotate-[-3deg] rounded bg-[#f8dc03]" />
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[#5a5f58]">
          Five-minute games across five finance career pathways — screens,
          negotiations, pitches and market calls. Twenty-six ways to test the
          fundamentals before you meet the real thing.
        </p>
      </header>

      {/* Stats */}
      <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-[0_1px_3px_rgba(14,14,14,0.04)]">
          <div className="flex items-center gap-2 text-[#8a8f88]">
            <Gamepad2 className="h-4 w-4" aria-hidden="true" />
            <span className="text-[11px] font-bold uppercase tracking-[0.12em]">
              Games played
            </span>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-[#0e0e0e]">
            {stats.gamesPlayed}
            <span className="text-base font-bold text-[#8a8f88]">
              {" "}
              / {stats.totalGames}
            </span>
          </p>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-[0_1px_3px_rgba(14,14,14,0.04)]">
          <div className="flex items-center gap-2 text-[#8a8f88]">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span className="text-[11px] font-bold uppercase tracking-[0.12em]">
              Total runs
            </span>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-[#0e0e0e]">
            {stats.totalPlays}
          </p>
        </div>
        <div className="col-span-2 rounded-2xl border border-black/10 bg-white p-4 shadow-[0_1px_3px_rgba(14,14,14,0.04)] sm:col-span-1">
          <div className="flex items-center gap-2 text-[#8a8f88]">
            <Layers className="h-4 w-4" aria-hidden="true" />
            <span className="text-[11px] font-bold uppercase tracking-[0.12em]">
              Pathways
            </span>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-[#0e0e0e]">
            {HUBS.length}
          </p>
        </div>
      </div>

      {!initialProgress.persisted && (
        <p className="mt-3 text-xs font-medium text-[#8a8f88]">
          Sync is offline — your results are saved on this device for now.
        </p>
      )}

      {/* Filter pills */}
      <div className="sticky top-[72px] z-20 -mx-2 mt-6 flex gap-2 overflow-x-auto px-2 py-3">
        {(
          [{ slug: "all", label: "All games" }, ...HUBS] as Array<Pick<HubMeta, "slug" | "label">>
        ).map((tab) => {
          const active = filter === tab.slug;
          const count =
            tab.slug === "all"
              ? catalogue.length
              : catalogue.filter((entry) => entry.hub.slug === tab.slug).length;
          return (
            <button
              key={tab.slug}
              type="button"
              onClick={() => setFilter(tab.slug as HubFilter)}
              aria-pressed={active}
              className={cn(
                "inline-flex h-9 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-all",
                active
                  ? "bg-[#0e0e0e] text-white shadow-[0_4px_14px_rgba(14,14,14,0.25)]"
                  : "border border-black/10 bg-white text-[#5a5f58] hover:border-black/30",
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[11px] font-bold",
                  active ? "bg-white/20 text-white" : "bg-black/[0.06] text-[#8a8f88]",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {activeHub && (
        <div className="-mt-1 mb-4">
          <Link
            href={`/mini-games/${activeHub.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0e0e0e] underline decoration-[#f8dc03] decoration-2 underline-offset-4 hover:decoration-[#0e0e0e]"
          >
            Open the full {activeHub.label} hub
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      )}

      {/* Game cards */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map(({ game, hub, slug }) => {
          const item = progressByGame.get(progressKey(hub.slug, slug));
          const played = (item?.plays ?? 0) > 0;
          const best = bestLabel(item);

          return (
            <MiniGameCardLink
              key={game.gameId}
              href={game.href}
              className="group flex flex-col rounded-[28px] border-2 border-[#0e0e0e] bg-white p-5 shadow-[6px_6px_0_rgba(14,14,14,0.12)] transition-shadow duration-200 hover:shadow-[6px_6px_0_#f8dc03] sm:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em]"
                  style={{ backgroundColor: hub.accentBg, color: hub.accent }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: hub.accent }}
                    aria-hidden="true"
                  />
                  {hub.label}
                </span>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.08em]",
                    played
                      ? "bg-[#eef3e9] text-[#3a3f39]"
                      : "bg-[#f8dc03] text-[#0e0e0e]",
                  )}
                >
                  {played ? "Played" : "New"}
                </span>
              </div>

              <h2 className="mt-4 text-lg font-extrabold leading-snug text-[#0e0e0e]">
                {game.title}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[#5a5f58]">
                {game.description}
              </p>

              <div className="mt-5 flex items-center justify-between gap-3 border-t border-black/[0.07] pt-4">
                <span className="text-xs font-semibold text-[#8a8f88]">
                  {played
                    ? `${item?.plays} ${item?.plays === 1 ? "play" : "plays"}${best ? ` · ${best}` : ""}`
                    : game.duration}
                </span>
                <span className="inline-flex items-center gap-1 text-sm font-bold text-[#0e0e0e]">
                  Play
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </MiniGameCardLink>
          );
        })}
      </div>

      <p className="mt-8 text-xs font-medium text-[#8a8f88]">
        Best on desktop. Some games use your keyboard (arrow keys) for fast
        decisions.
      </p>
    </div>
  );
}
