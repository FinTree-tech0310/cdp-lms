"use client";

import { useState } from "react";
import { Bookmark, CalendarDays, Play, Radio } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  endsIn,
  expinarIcsHref,
  formatCardDate,
  relativeStart,
  toLiveExpinar,
  type ExpinarEvent,
  type ExpinarPhase,
} from "@/lib/expinars";
import { formatDuration, formatExpinarTime } from "@/lib/dashboard-format";
import { AddToCalendar } from "@/components/dashboard/add-to-calendar";

/** Display event: catalog row + phase for the current tick of the clock. */
export interface DisplayEvent extends ExpinarEvent {
  phase: ExpinarPhase;
}

interface ExpinarCardProps {
  event: DisplayEvent;
  index: number;
  nowMs: number;
  saved: boolean;
  onOpen: (id: string) => void;
  onToggleSave: (id: string) => void;
}

/** Deterministic gold / aqua / mint thumb tone per session (3-way rhythm). */
const TONES = [
  "radial-gradient(120% 130% at 85% 12%, rgba(248,220,3,0.34), transparent 58%)",
  "radial-gradient(120% 130% at 85% 12%, rgba(30,210,244,0.30), transparent 58%)",
  "radial-gradient(120% 130% at 85% 12%, rgba(233,247,229,0.30), transparent 58%)",
];

function toneFor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return TONES[hash % TONES.length];
}

function initialsOf(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase() || "E"
  );
}

export function ExpinarCard({
  event,
  index,
  nowMs,
  saved,
  onOpen,
  onToggleSave,
}: ExpinarCardProps) {
  // The calendar menu overflows the card face — lift the card while open
  // so neighbouring cards and the sticky filter bar can't cover the menu.
  const [calOpen, setCalOpen] = useState(false);

  const isUpcoming = event.phase === "upcoming";
  const isLive = event.phase === "live";
  const isRecorded = event.phase === "recorded";

  const startDate = new Date(event.startsAt);
  const status = (() => {
    if (isLive) {
      const ends = endsIn(event.startsAt, event.durationSeconds, nowMs);
      return (
        <>
          <span className="font-semibold text-[#e50914]">Live now</span>
          <span className="text-[#5a5f58]">
            {event.viewers != null ? `, ${event.viewers} watching` : ""}
            {ends ? ` · ${ends}` : ""}
          </span>
        </>
      );
    }

    if (isUpcoming) {
      return (
        <span className="text-[#5a5f58]">
          {formatCardDate(startDate)} at {formatExpinarTime(startDate)}
          <span className="text-[#8a8f88]">
            {" · "}
            {relativeStart(event.startsAt, nowMs)}
          </span>
        </span>
      );
    }

    return (
      <span className="text-[#5a5f58]">
        {event.hint ?? `Recorded live on ${formatCardDate(startDate)}`}
      </span>
    );
  })();

  const WatermarkIcon = isLive ? Radio : isUpcoming ? CalendarDays : Play;

  return (
    <article
      className={cn(
        "group animate-rise-in relative rounded-[28px] border-2 border-[#0e0e0e] bg-white p-3 shadow-[6px_6px_0_rgba(14,14,14,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0_#f8dc03]",
        calOpen && "z-30",
      )}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Primary target: thumb + meta. Bookmark/notify stay siblings so no
          button ever nests inside another — all three share the card face. */}
      <button
        type="button"
        onClick={() => onOpen(event.id)}
        aria-label={`Open ${event.title}`}
        className="block w-full cursor-pointer overflow-hidden rounded-[18px] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1ed2f4]"
      >
        {/* ---------- Thumbnail ---------- */}
        <span className="relative block aspect-[16/9] overflow-hidden rounded-[18px] bg-[#0e0e0e]">
          <span
            aria-hidden
            className="absolute inset-0"
            style={{ backgroundImage: toneFor(event.id) }}
          />

          <WatermarkIcon
            aria-hidden
            className="absolute -bottom-5 right-2 h-28 w-28 rotate-6 text-white/[0.07] transition duration-500 group-hover:scale-105"
          />

          {/* Phase badge */}
          <span className="absolute left-3 top-3">
            {isLive && (
              <span className="flex items-center gap-1.5 rounded-md bg-[#e50914] px-2.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-white shadow-sm">
                <span className="relative flex h-1.5 w-1.5" aria-hidden>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                </span>
                Live
              </span>
            )}

            {isUpcoming && (
              <span className="inline-block rounded-md bg-white px-2.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#0e0e0e] shadow-sm">
                Upcoming
              </span>
            )}
          </span>

          {/* Duration chip */}
          {isRecorded && event.durationSeconds != null && (
            <span className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2 py-1 font-mono text-xs font-semibold text-white backdrop-blur-sm">
              {formatDuration(event.durationSeconds)}
            </span>
          )}

          {/* Recorded hover affordance */}
          {isRecorded && (
            <span
              aria-hidden
              className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition duration-300 group-hover:bg-black/25 group-hover:opacity-100"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f8dc03] text-[#0e0e0e] shadow-lg transition group-hover:scale-110">
                <Play className="ml-0.5 h-5 w-5" fill="currentColor" />
              </span>
            </span>
          )}

          {/* Title on the thumb */}
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-4 pt-10">
            <span className="block max-w-[85%] text-lg font-extrabold leading-tight tracking-[-0.02em] text-white sm:text-xl">
              {event.title}
            </span>
            <span
              aria-hidden
              className="mt-2 block h-[3px] w-10 rotate-[-3deg] rounded bg-[#f8dc03]"
            />
          </span>
        </span>

        {/* ---------- Meta ---------- */}
        <span className="flex items-start gap-3 pb-1 pt-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1ed2f4] text-xs font-bold text-[#0e0e0e]">
            {initialsOf(event.speaker)}
          </span>

          <span className="min-w-0 flex-1">
            <span className="block truncate text-[15px] font-bold tracking-[-0.01em] text-[#0e0e0e]">
              {event.title}
            </span>
            <span className="mt-0.5 block truncate text-sm text-[#5a5f58]">
              {event.speaker}
              {event.speakerRole ? `, ${event.speakerRole}` : ""}
            </span>
            <span className="mt-1 block text-sm">{status}</span>
          </span>
        </span>
      </button>

      {/* ---------- Save (bookmark) — sibling, overlays the thumb ---------- */}
      <button
        type="button"
        onClick={() => onToggleSave(event.id)}
        aria-pressed={saved}
        aria-label={saved ? `Remove ${event.title} from saved` : `Save ${event.title}`}
        title={saved ? "Saved" : "Save"}
        className={cn(
          "absolute right-6 top-6 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full backdrop-blur-sm transition",
          saved
            ? "bg-[#f8dc03] text-[#0e0e0e] shadow-md hover:bg-[#ffe14a]"
            : "bg-white/85 text-[#0e0e0e] opacity-0 hover:bg-white focus-visible:opacity-100 group-hover:opacity-100",
        )}
      >
        <Bookmark className="h-4 w-4" fill={saved ? "currentColor" : "none"} />
      </button>

      {/* ---------- Add to calendar — sibling under the meta, inside the
          card. Same dropdown the dashboard's Expinar card uses. ---------- */}
      {isUpcoming && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <AddToCalendar
            expinar={toLiveExpinar(event)}
            icsHref={expinarIcsHref(event.id)}
            onOpenChange={setCalOpen}
          />
        </div>
      )}
    </article>
  );
}
