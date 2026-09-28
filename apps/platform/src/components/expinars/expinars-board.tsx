"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bookmark,
  CalendarDays,
  Check,
  ChevronDown,
  PlayCircle,
  Radio,
  Search,
  SearchX,
  Eye,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  expinarPhase,
  type ExpinarEvent,
  type ExpinarPhase,
} from "@/lib/expinars";
import { CAREER_TRACK_TITLES } from "@/lib/career-tracks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExpinarCard, type DisplayEvent } from "./expinar-card";
import { ExpinarDialog } from "./expinar-dialog";

type TabId = "all" | "live" | "upcoming" | "recorded" | "watched" | "saved";

interface Marks {
  saved: string[];
  watched: string[];
}

const TABS: Array<{ id: TabId; label: string }> = [
  { id: "all", label: "All" },
  { id: "live", label: "Live now" },
  { id: "upcoming", label: "Upcoming" },
  { id: "recorded", label: "Recorded" },
  { id: "watched", label: "Watched" },
  { id: "saved", label: "Saved" },
];

const ALL_TRACKS = "All tracks";
const DEFAULT_TRACK = "Investment Banking";
/** Same five options as the careers page, in the same order. */
const TRACK_OPTIONS = [ALL_TRACKS, ...CAREER_TRACK_TITLES];
const MARKS_KEY = "cdp-expinar-marks";

const EMPTY_COPY: Record<
  TabId,
  { icon: typeof Radio; title: string; body: string }
> = {
  all: {
    icon: CalendarDays,
    title: "No sessions match",
    body: "Try a different search or track — new Expinars land every week.",
  },
  live: {
    icon: Radio,
    title: "Nothing live right now",
    body: "The next session starts soon — check Upcoming and set a reminder.",
  },
  upcoming: {
    icon: CalendarDays,
    title: "No upcoming sessions",
    body: "Once one is scheduled it will appear here with a reminder option.",
  },
  recorded: {
    icon: PlayCircle,
    title: "No recordings yet",
    body: "Sessions land here after they air, ready to watch on your schedule.",
  },
  watched: {
    icon: Eye,
    title: "Nothing watched yet",
    body: "Mark a recording as watched and it will collect here for review.",
  },
  saved: {
    icon: Bookmark,
    title: "Nothing saved yet",
    body: "Tap the bookmark on any session to keep it here for later.",
  },
};

interface ExpinarsBoardProps {
  events: ExpinarEvent[];
  serverNow: number;
}

function toggleId(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

export function ExpinarsBoard({ events, serverNow }: ExpinarsBoardProps) {
  const [tab, setTab] = useState<TabId>("all");
  const [query, setQuery] = useState("");
  const [track, setTrack] = useState<string>(() =>
    CAREER_TRACK_TITLES.includes(DEFAULT_TRACK) ? DEFAULT_TRACK : ALL_TRACKS,
  );
  // Elevated above the sticky filter bar only while the track menu is open,
  // so the open menu paints crisp (the bar's backdrop-blur otherwise blurs it).
  const [trackMenuOpen, setTrackMenuOpen] = useState(false);
  // Starts on the server's clock so hydration matches, then ticks live.
  const [now, setNow] = useState(() => serverNow);
  const [marks, setMarks] = useState<Marks>({
    saved: [],
    watched: [],
  });
  const [marksLoaded, setMarksLoaded] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  /* ------------ clock: phase labels, countdowns and liveness tick ------------- */
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  /* --------------------------- saved / watched / notified --------------------- */
  useEffect(() => {
    const read = () => {
      try {
        const raw = localStorage.getItem(MARKS_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<Marks>;
          setMarks({
            saved: parsed.saved ?? [],
            watched: parsed.watched ?? [],
          });
        }
      } catch {
        // Corrupt storage — start clean.
      }
      setMarksLoaded(true);
    };

    read();

    const onStorage = (e: StorageEvent) => {
      if (e.key === MARKS_KEY) read();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!marksLoaded) return;
    try {
      localStorage.setItem(MARKS_KEY, JSON.stringify(marks));
    } catch {
      // Storage full/blocked — state still works for this tab.
    }
  }, [marks, marksLoaded]);

  /* --------------------------------- derived -------------------------------- */
  const display: DisplayEvent[] = useMemo(
    () =>
      events.map((event) => ({
        ...event,
        phase: expinarPhase(event, now),
      })),
    [events, now],
  );

  const matchesQuery = (event: DisplayEvent) => {
    if (!query.trim()) return true;
    const needle = query.trim().toLowerCase();
    return [event.title, event.speaker, event.speakerRole, event.detail]
      .join(" ")
      .toLowerCase()
      .includes(needle);
  };

  const matchesTrack = (event: DisplayEvent) =>
    track === ALL_TRACKS || event.track === track;

  const inScope = useMemo(
    () => display.filter((e) => matchesQuery(e) && matchesTrack(e)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [display, query, track],
  );

  const counts = useMemo(() => {
    const live = inScope.filter((e) => e.phase === "live").length;
    const upcoming = inScope.filter((e) => e.phase === "upcoming").length;
    const recorded = inScope.filter((e) => e.phase === "recorded").length;
    return {
      all: inScope.length,
      live,
      upcoming,
      recorded,
      watched: inScope.filter(
        (e) => e.phase === "recorded" && marks.watched.includes(e.id),
      ).length,
      saved: inScope.filter((e) => marks.saved.includes(e.id)).length,
    } satisfies Record<TabId, number>;
  }, [inScope, marks]);

  const shown = useMemo(() => {
    switch (tab) {
      case "live":
        return inScope.filter((e) => e.phase === "live");
      case "upcoming":
        return inScope.filter((e) => e.phase === "upcoming");
      case "recorded":
        return inScope.filter((e) => e.phase === "recorded");
      case "watched":
        return inScope.filter(
          (e) => e.phase === "recorded" && marks.watched.includes(e.id),
        );
      case "saved":
        return inScope.filter((e) => marks.saved.includes(e.id));
      default:
        return inScope;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inScope, tab, marks]);

  const phaseRank = (phase: ExpinarPhase) =>
    phase === "live" ? 0 : phase === "upcoming" ? 1 : 2;

  const liveUpcoming = shown
    .filter((e) => e.phase !== "recorded")
    .sort(
      (a, b) =>
        phaseRank(a.phase) - phaseRank(b.phase) ||
        Date.parse(a.startsAt) - Date.parse(b.startsAt),
    );

  const recorded = shown
    .filter((e) => e.phase === "recorded")
    .sort((a, b) => Date.parse(b.startsAt) - Date.parse(a.startsAt));

  const openEvent = openId
    ? display.find((e) => e.id === openId) ?? null
    : null;

  const hasFilters = Boolean(query.trim()) || track !== ALL_TRACKS;

  const clearFilters = () => {
    setQuery("");
    setTrack(ALL_TRACKS);
  };

  /* --------------------------------- render -------------------------------- */
  const gridKey = `${tab}|${track}|${query}`;

  const renderCards = (items: DisplayEvent[]) => (
    <div
      key={gridKey}
      className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
    >
      {items.map((event, index) => (
        <ExpinarCard
          key={event.id}
          event={event}
          index={index}
          nowMs={now}
          saved={marks.saved.includes(event.id)}
          onOpen={setOpenId}
          onToggleSave={(id) =>
            setMarks((prev) => ({ ...prev, saved: toggleId(prev.saved, id) }))
          }
        />
      ))}
    </div>
  );

  const sectionHeading = (title: string, count: number) => (
    <div className="mb-5 flex items-center gap-3">
      <h2 className="text-xl font-extrabold tracking-[-0.02em] text-[#0e0e0e] sm:text-2xl">
        {title}
      </h2>
      <span className="rounded-full bg-black/[0.06] px-2.5 py-1 text-xs font-bold text-[#5a5f58]">
        {count}
      </span>
    </div>
  );

  const emptyState = () => {
    const copy = EMPTY_COPY[tab];
    const Icon = copy.icon;

    return (
      <div
        key={gridKey}
        className="animate-rise-in rounded-[28px] border-2 border-dashed border-black/20 bg-white/70 px-6 py-14 text-center"
      >
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f6f7f4] text-[#8a8f88]">
          <Icon className="h-6 w-6" />
        </span>
        <h3 className="mt-4 text-lg font-bold tracking-[-0.02em] text-[#0e0e0e]">
          {copy.title}
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#5a5f58]">
          {copy.body}
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 inline-flex h-10 cursor-pointer items-center gap-2 rounded-full bg-[#0e0e0e] px-5 text-sm font-semibold text-white transition hover:bg-[#26261f]"
          >
            <SearchX className="h-4 w-4" />
            Clear filters
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-7 lg:px-10 lg:py-10">
      {/* ---------------- Toolbar: title · search · track --------------- */}
      <section
        className={cn(
          "animate-rise-in rounded-[28px] border-2 border-[#0e0e0e] bg-white p-5 shadow-[6px_6px_0_rgba(14,14,14,0.12)] sm:p-6",
          trackMenuOpen && "relative z-[25]",
        )}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
          <div className="shrink-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e50914]">
              Learn from practitioners
            </p>
            <h1 className="mt-1.5 text-3xl font-extrabold tracking-[-0.04em] text-[#0e0e0e] sm:text-4xl">
              Expinars
            </h1>
          </div>

          <div className="relative w-full flex-1 lg:mx-auto lg:max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a8f88]" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Expinars"
              aria-label="Search Expinars"
              className="h-11 w-full cursor-text rounded-full border border-black/15 bg-[#f6f7f4] pl-11 pr-10 text-sm text-[#0e0e0e] outline-none transition placeholder:text-[#8a8f88] focus:border-[#0e0e0e] focus:bg-white focus:ring-2 focus:ring-[#1ed2f4]/40"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-[#8a8f88] transition hover:bg-black/5 hover:text-[#0e0e0e]"
              >
                <span className="text-lg leading-none">×</span>
              </button>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <DropdownMenu onOpenChange={setTrackMenuOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-black/15 bg-white px-4 text-sm font-semibold text-[#0e0e0e] transition hover:border-[#0e0e0e]"
                >
                  <span className="font-medium text-[#5a5f58]">Track:</span>
                  {track}
                  <ChevronDown className="h-4 w-4 text-[#8a8f88]" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-60 rounded-2xl border-black/10 bg-white p-2 shadow-xl"
              >
                {TRACK_OPTIONS.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() => setTrack(option)}
                    className={cn(
                      "cursor-pointer gap-2 rounded-lg px-3 py-2 text-sm",
                      option === track && "font-semibold",
                    )}
                  >
                    <span className="flex w-full items-center gap-2">
                      {option === track && (
                        <Check className="h-4 w-4 shrink-0 text-[#0e0e0e]" />
                      )}
                      {option}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </section>

      {/* ------------------------------- Filter tabs ------------------------------ */}
      <div className="sticky top-[72px] z-20 -mx-2 mt-5 flex gap-2 overflow-x-auto px-2 py-3 backdrop-blur-sm">
        {TABS.map((item) => {
          const active = tab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              aria-pressed={active}
              className={cn(
                "inline-flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-semibold transition duration-200",
                active
                  ? "bg-[#0e0e0e] text-white shadow-[0_4px_14px_rgba(14,14,14,0.25)]"
                  : "border border-black/10 bg-white text-[#5a5f58] hover:border-black/30 hover:text-[#0e0e0e]",
              )}
            >
              {item.label}
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[11px] font-bold leading-none",
                  active
                    ? "bg-white/20 text-white"
                    : "bg-black/[0.06] text-[#8a8f88]",
                )}
              >
                {counts[item.id]}
              </span>
            </button>
          );
        })}
      </div>

      {/* -------------------------------- Sections -------------------------------- */}
      <div className="mt-4 space-y-10 pb-6">
        {tab === "all" ? (
          <>
            {liveUpcoming.length > 0 && (
              <section>
                {sectionHeading("Live and upcoming", liveUpcoming.length)}
                {renderCards(liveUpcoming)}
              </section>
            )}

            {recorded.length > 0 && (
              <section>
                {sectionHeading("Recorded", recorded.length)}
                {renderCards(recorded)}
              </section>
            )}

            {/* Only show the empty box when nothing matched anywhere. */}
            {liveUpcoming.length === 0 && recorded.length === 0 && (
              <section>{emptyState()}</section>
            )}
          </>
        ) : (
          <section>
            {sectionHeading(TABS.find((t) => t.id === tab)?.label ?? "", shown.length)}
            {shown.length > 0 ? renderCards(shown) : emptyState()}
          </section>
        )}
      </div>

      {/* --------------------------------- Dialog --------------------------------- */}
      {openEvent && (
        <ExpinarDialog
          event={openEvent}
          nowMs={now}
          saved={marks.saved.includes(openEvent.id)}
          watched={marks.watched.includes(openEvent.id)}
          onClose={() => setOpenId(null)}
          onToggleSave={(id) =>
            setMarks((prev) => ({ ...prev, saved: toggleId(prev.saved, id) }))
          }
          onToggleWatched={(id) =>
            setMarks((prev) => ({
              ...prev,
              watched: toggleId(prev.watched, id),
            }))
          }
        />
      )}
    </div>
  );
}
