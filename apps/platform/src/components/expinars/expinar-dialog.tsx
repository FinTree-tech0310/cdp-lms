"use client";

import { useEffect, useRef } from "react";
import { Bookmark, Check, ExternalLink, X } from "lucide-react";

import { APP_CONFIG } from "@/lib/config";
import { cn } from "@/lib/utils";
import {
  endsIn,
  expinarIcsHref,
  formatCardDate,
  relativeStart,
  toLiveExpinar,
  type ExpinarEvent,
} from "@/lib/expinars";
import { formatDuration, formatExpinarTime } from "@/lib/dashboard-format";
import { AddToCalendar } from "@/components/dashboard/add-to-calendar";
import type { DisplayEvent } from "./expinar-card";

interface ExpinarDialogProps {
  event: DisplayEvent;
  nowMs: number;
  saved: boolean;
  watched: boolean;
  onClose: () => void;
  onToggleSave: (id: string) => void;
  onToggleWatched: (id: string) => void;
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

/** The live-room URL from env; "#"/placeholder values count as unset. */
function liveRoomUrl(): string | null {
  const url = APP_CONFIG.expinarUrl?.trim();
  if (!url || url === "#") return null;
  if (/YOUR-|example\.com/i.test(url)) return null;
  return url;
}

export function ExpinarDialog({
  event,
  nowMs,
  saved,
  watched,
  onClose,
  onToggleSave,
  onToggleWatched,
}: ExpinarDialogProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const startDate = new Date(event.startsAt);
  const isLive = event.phase === "live";
  const isUpcoming = event.phase === "upcoming";
  const isRecorded = event.phase === "recorded";
  const roomUrl = liveRoomUrl();

  // Escape closes, background stops scrolling, focus lands on close.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const metaChips = [
    `${formatCardDate(startDate)}`,
    formatExpinarTime(startDate),
    event.durationSeconds != null
      ? formatDuration(event.durationSeconds)
      : null,
    event.track,
    isLive && event.viewers != null ? `${event.viewers} watching` : null,
    isUpcoming ? relativeStart(event.startsAt, nowMs) : null,
  ].filter((chip): chip is string => Boolean(chip));

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#0e0e0e]/70 p-4 backdrop-blur-sm sm:p-8"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="expinar-dialog-title"
        className="animate-rise-in relative my-auto w-full max-w-2xl overflow-hidden rounded-[28px] border-2 border-[#0e0e0e] bg-white shadow-[10px_10px_0_rgba(14,14,14,0.25)]"
      >
        {/* ---------- Hero ---------- */}
        <div className="relative bg-[#0e0e0e] px-6 pb-7 pt-16 sm:px-8">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage:
                isLive
                  ? "radial-gradient(130% 140% at 85% 0%, rgba(229,9,20,0.4), transparent 60%)"
                  : isUpcoming
                    ? "radial-gradient(130% 140% at 85% 0%, rgba(30,210,244,0.3), transparent 60%)"
                    : "radial-gradient(130% 140% at 85% 0%, rgba(248,220,3,0.32), transparent 60%)",
            }}
          />

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close session details"
            className="absolute right-4 top-4 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1ed2f4]"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative">
            {isLive && (
              <span className="mb-3 inline-flex items-center gap-1.5 rounded-md bg-[#e50914] px-2.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-white">
                <span className="relative flex h-1.5 w-1.5" aria-hidden>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                </span>
                Live now
              </span>
            )}

            <h2
              id="expinar-dialog-title"
              className="text-2xl font-extrabold leading-tight tracking-[-0.03em] text-white sm:text-3xl"
            >
              {event.title}
            </h2>

            <span
              aria-hidden
              className="mt-3 block h-[3px] w-12 rotate-[-3deg] rounded bg-[#f8dc03]"
            />

            <div className="mt-4 flex flex-wrap gap-2">
              {metaChips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-sm"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ---------- Body ---------- */}
        <div className="space-y-5 px-6 py-6 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1ed2f4] text-sm font-bold text-[#0e0e0e]">
              {initialsOf(event.speaker)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[#0e0e0e]">
                {event.speaker}
              </p>
              <p className="truncate text-sm text-[#5a5f58]">
                {event.speakerRole || "Rarewise faculty"}
              </p>
            </div>

            <span className="ml-auto hidden rounded-md bg-[#f8dc03] px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#0e0e0e] sm:inline-block">
              {event.track ?? "Expinar"}
            </span>
          </div>

          {event.detail && (
            <p className="text-sm leading-6 text-[#5a5f58] sm:text-base">
              {event.detail}
            </p>
          )}

          {event.hint && (
            <p className="text-sm font-semibold text-[#0e0e0e]">
              {event.hint}
            </p>
          )}

          {/* Join/room note only makes sense before or during the session. */}
          {(isLive || isUpcoming) && (
            <div className="rounded-2xl border border-dashed border-black/20 bg-[#f6f7f4] p-4 text-sm leading-6 text-[#5a5f58]">
              {isLive && !roomUrl
                ? "The live room link activates here the moment the session opens."
                : event.joinNote}
              {isLive && endsIn(event.startsAt, event.durationSeconds, nowMs)
                ? ` ${endsIn(event.startsAt, event.durationSeconds, nowMs)}.`
                : ""}
            </div>
          )}
        </div>

        {/* ---------- Footer actions ---------- */}
        <div className="flex flex-col gap-3 border-t border-black/10 bg-[#f6f7f4] px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <button
            type="button"
            onClick={() => onToggleSave(event.id)}
            aria-pressed={saved}
            className={cn(
              "inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition",
              saved
                ? "bg-[#0e0e0e] text-white hover:bg-[#26261f]"
                : "border border-black/15 bg-white text-[#0e0e0e] hover:border-[#0e0e0e]",
            )}
          >
            <Bookmark className="h-4 w-4" fill={saved ? "currentColor" : "none"} />
            {saved ? "Saved" : "Save"}
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {isUpcoming && (
              <AddToCalendar
                expinar={toLiveExpinar(event)}
                icsHref={expinarIcsHref(event.id)}
                side="top"
                align="end"
              />
            )}

            {isLive &&
              (roomUrl ? (
                <a
                  href={roomUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full bg-[#e50914] px-5 text-sm font-semibold text-white transition hover:bg-[#c40711]"
                >
                  Open live room
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : (
                <span className="inline-flex h-10 items-center gap-2 rounded-full bg-[#e9e9e4] px-5 text-sm font-semibold text-[#8a8f88]">
                  Live room pending
                </span>
              ))}

            {isRecorded && (
              <button
                type="button"
                onClick={() => onToggleWatched(event.id)}
                aria-pressed={watched}
                className={cn(
                  "inline-flex h-10 cursor-pointer items-center gap-2 rounded-full px-5 text-sm font-semibold transition",
                  watched
                    ? "bg-[#f8dc03] text-[#0e0e0e] hover:bg-[#ffe14a]"
                    : "bg-[#0e0e0e] text-white hover:bg-[#26261f]",
                )}
              >
                {watched ? (
                  <>
                    <Check className="h-4 w-4" /> Watched
                  </>
                ) : (
                  "Mark as watched"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
