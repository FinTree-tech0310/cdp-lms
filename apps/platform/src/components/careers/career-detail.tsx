"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Sparkles,
  SquarePlay,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  applyProgressRows,
  curriculumDurationSeconds,
  curriculumSummary,
  defaultProgress,
  findCurriculumItem,
  formatContentDuration,
  isSectionComplete,
  sectionMeta,
  withItemCompleted,
  type CareerProgressState,
  type CourseCurriculum,
  type CourseSection,
  type ProgressRow,
  type SectionProgressState,
} from "@/lib/career-curriculum";

interface CareerDetailProps {
  career: {
    title: string;
    description: string;
    category: string;
  };
  curriculum?: CourseCurriculum;
  onBack: () => void;
}

type ProgressMap = CareerProgressState;
type SectionProgress = SectionProgressState;

/** Progress survives closing/reopening the syllabus (and full reloads). */
function storageKey(curriculum?: CourseCurriculum): string | null {
  return curriculum ? `cdp-career-progress:${curriculum.id}` : null;
}

function loadProgress(curriculum?: CourseCurriculum): ProgressMap | null {
  const key = storageKey(curriculum);
  if (!curriculum || !key || typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;

    const stored: unknown = JSON.parse(raw);
    if (!stored || typeof stored !== "object") return null;

    // Rebase onto the fresh defaults so missing/mismatched sections reset.
    const merged = defaultProgress(curriculum);
    for (const [id, fallback] of Object.entries(merged)) {
      const value = (stored as Record<string, SectionProgress | undefined>)[
        id
      ];

      if (
        value &&
        Array.isArray(value.watched) &&
        value.watched.length === fallback.watched.length
      ) {
        merged[id] = {
          watched: value.watched.map(Boolean),
          quizDone: Boolean(value.quizDone),
        };
      }
    }

    return merged;
  } catch {
    return null;
  }
}

function saveProgress(curriculum: CourseCurriculum | undefined, value: ProgressMap) {
  const key = storageKey(curriculum);
  if (!key || typeof window === "undefined") return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked — progress simply stays in memory */
  }
}

function watchedLabel(
  section: CourseSection,
  progress: SectionProgress | undefined,
): string | null {
  if (isSectionComplete(section, progress)) return "Completed";

  const watched = progress?.watched.filter(Boolean).length ?? 0;
  if (watched === 0) return null;

  return `${watched} of ${section.lectures.length} watched`;
}

/** Gold check pill / quiet dot + label — never two competing greens. */
function StatusTag({ label }: { label: string | null }) {
  if (!label) return null;

  if (label === "Completed") {
    return (
      <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#0e0e0e]">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f8dc03]">
          <Check className="h-3.5 w-3.5" strokeWidth={3.5} />
        </span>
        Completed
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 text-sm text-[#5a5f58]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#1ed2f4]" />
      {label}
    </span>
  );
}

/** Gold check + label — the "Watched" / "Completed" state. */
function WatchedTag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#0e0e0e]">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f8dc03]">
        <Check className="h-3.5 w-3.5" strokeWidth={3.5} />
      </span>
      {label}
    </span>
  );
}

/** Text action in a lecture row: "Start" or "Resume" (+ mini progress). */
function LectureAction({
  label,
  inProgress,
  onClick,
}: {
  label: "Start" | "Resume";
  inProgress?: boolean;
  onClick: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-3">
      {inProgress && (
        <span
          aria-hidden
          className="h-1.5 w-16 overflow-hidden rounded-full bg-[#e9e9e4]"
        >
          <span className="block h-full w-[45%] rounded-full bg-[#1ed2f4]" />
        </span>
      )}

      <button
        type="button"
        onClick={onClick}
        className="cursor-pointer text-sm font-semibold text-[#0e0e0e] underline decoration-[#f8dc03] decoration-2 underline-offset-4 transition hover:decoration-[#1ed2f4]"
      >
        {label}
      </button>
    </span>
  );
}

export function CareerDetail({
  career,
  curriculum,
  onBack,
}: CareerDetailProps) {
  const [progress, setProgress] = useState<ProgressMap>(
    () => (curriculum ? defaultProgress(curriculum) : {}),
  );
  const [openIds, setOpenIds] = useState<string[]>([]);
  // Lecture blurbs start expanded; an entry only exists once collapsed.
  const [openLectures, setOpenLectures] = useState<Record<string, boolean>>({});
  const [barReady, setBarReady] = useState(false);
  // Quiet note when progress can only live on this device.
  const [syncNote, setSyncNote] = useState<string | null>(null);

  const headingRef = useRef<HTMLHeadingElement>(null);
  // Blocks the save effect until the stored progress has been applied.
  const progressHydrated = useRef(false);
  // This tab's toggles, replayed over any snapshot that arrives late so a
  // slow server response never rolls back something just clicked.
  const sessionOps = useRef(new Map<string, boolean>());

  const replaySessionOps = (state: ProgressMap): ProgressMap => {
    if (!curriculum || sessionOps.current.size === 0) return state;

    let next = state;
    for (const [itemId, completed] of sessionOps.current) {
      next = withItemCompleted(curriculum, next, itemId, completed);
    }
    return next;
  };

  // Grow the progress bar from 0 the first time the view is on screen.
  useEffect(() => {
    const frame = requestAnimationFrame(() => setBarReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Restore saved progress after mount (avoids a hydration mismatch).
  useEffect(() => {
    const stored = loadProgress(curriculum);
    if (stored) setProgress(stored);
    progressHydrated.current = true;
  }, [curriculum]);

  useEffect(() => {
    if (!progressHydrated.current) return;
    saveProgress(curriculum, progress);
  }, [curriculum, progress]);

  // Server copy: layer the stored rows over whatever the cache had, then
  // re-apply this tab's own clicks. Rows include explicit "not watched"
  // decisions, so un-watching survives a reload too.
  useEffect(() => {
    if (!curriculum) return;

    let cancelled = false;

    (async () => {
      try {
        const response = await fetch(
          `/api/careers/${curriculum.id}/progress`,
          { cache: "no-store" },
        );

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data: unknown = await response.json();
        const payload = (data ?? {}) as {
          persisted?: boolean;
          items?: ProgressRow[];
        };

        if (cancelled) return;

        if (!payload.persisted || !Array.isArray(payload.items)) {
          setSyncNote("Saved on this device");
          return;
        }

        setProgress((current) =>
          replaySessionOps(
            applyProgressRows(curriculum, current, payload.items ?? []),
          ),
        );
        setSyncNote((current) => (current === "Saving…" ? current : null));
      } catch {
        if (!cancelled) setSyncNote("Saved on this device");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [curriculum]);

  // Another tab saved the same syllabus — adopt its state and keep ours on top.
  useEffect(() => {
    if (!curriculum) return;

    const onStorage = (event: StorageEvent) => {
      const key = storageKey(curriculum);
      if (!key || event.key !== key || !event.newValue) return;

      const stored = loadProgress(curriculum);
      if (stored) setProgress(replaySessionOps(stored));
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [curriculum]);

  // Land the reader at the top of the syllabus, keyboard focus included.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  const sections = curriculum?.sections ?? [];

  const completedCount = useMemo(
    () =>
      sections.filter((section) =>
        isSectionComplete(section, progress[section.id]),
      ).length,
    [sections, progress],
  );

  const lectureCount = useMemo(
    () =>
      sections.reduce((total, section) => total + section.lectures.length, 0),
    [sections],
  );

  const contentSeconds = useMemo(
    () => (curriculum ? curriculumDurationSeconds(curriculum) : 0),
    [curriculum],
  );

  const percent =
    sections.length > 0
      ? Math.round((completedCount / sections.length) * 100)
      : 0;

  const nextSection = useMemo(
    () =>
      sections.find(
        (section) => !isSectionComplete(section, progress[section.id]),
      ) ?? null,
    [sections, progress],
  );

  const allOpen = sections.length > 0 && openIds.length === sections.length;

  const toggleOpen = (id: string) =>
    setOpenIds((current) =>
      current.includes(id)
        ? current.filter((openId) => openId !== id)
        : [...current, id],
    );

  /** Optimistic local flip + a matching write to the backend. */
  const syncItem = (itemId: string, completed: boolean) => {
    if (!curriculum) return;

    sessionOps.current.set(itemId, completed);
    setSyncNote("Saving…");

    fetch(`/api/careers/${curriculum.id}/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, completed }),
    })
      .then(async (response) => {
        const data = (await response.json().catch(() => null)) as {
          persisted?: boolean;
        } | null;

        setSyncNote(response.ok && data?.persisted ? null : "Saved on this device");
      })
      .catch(() => setSyncNote("Saved on this device"));
  };

  const toggleLecture = (sectionId: string, lectureIndex: number) => {
    const sectionProgress = progress[sectionId];
    const lecture = sections.find((section) => section.id === sectionId)
      ?.lectures[lectureIndex];
    if (!sectionProgress || !lecture) return;

    setProgress((current) => {
      const currentSection = current[sectionId];
      if (!currentSection) return current;

      const watched = [...currentSection.watched];
      watched[lectureIndex] = !watched[lectureIndex];

      return { ...current, [sectionId]: { ...currentSection, watched } };
    });

    syncItem(lecture.id, !sectionProgress.watched[lectureIndex]);
  };

  const toggleQuiz = (sectionId: string) => {
    const sectionProgress = progress[sectionId];
    const quiz = sections.find((section) => section.id === sectionId)?.quiz;
    if (!sectionProgress || !quiz) return;

    setProgress((current) => {
      const currentSection = current[sectionId];
      if (!currentSection) return current;

      return {
        ...current,
        [sectionId]: {
          ...currentSection,
          quizDone: !currentSection.quizDone,
        },
      };
    });

    syncItem(quiz.id, !sectionProgress.quizDone);
  };

  const toggleLectureNote = (lectureId: string) =>
    setOpenLectures((current) => ({
      ...current,
      [lectureId]: !(current[lectureId] ?? true),
    }));

  const resume = () => {
    if (!nextSection) return;

    if (!openIds.includes(nextSection.id)) {
      setOpenIds((current) => [...current, nextSection.id]);
    }

    // Wait for the panel to finish opening before bringing it into view.
    window.setTimeout(() => {
      document
        .getElementById(`section-${nextSection.id}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 350);
  };

  /* ---------------------------------------------------------- fallback */
  if (!curriculum) {
    return (
      <div className="animate-rise-in">
        <BackButton onClick={onBack} />

        <section className="rounded-[28px] border-2 border-[#0e0e0e] bg-white p-6 shadow-[6px_6px_0_rgba(14,14,14,0.12)] sm:p-9">
          <span className="inline-block rounded-md bg-[#f8dc03] px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#0e0e0e]">
            {career.category}
          </span>

          <h1
            ref={headingRef}
            tabIndex={-1}
            className="mt-4 text-3xl font-extrabold tracking-[-0.04em] outline-none sm:text-4xl"
          >
            Career in {career.title}
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-[#5a5f58] sm:text-base">
            {career.description}
          </p>

          <div className="mt-7 rounded-2xl border border-dashed border-black/20 bg-[#f6f7f4] p-6 text-center sm:p-8">
            <Sparkles className="mx-auto h-6 w-6 text-[#1ed2f4]" />
            <h2 className="mt-3 text-lg font-bold tracking-[-0.02em]">
              Syllabus in the works
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#5a5f58]">
              The {career.title} path is still being drafted. The Investment
              Banking syllabus is live today — open it to see how a full path
              is structured.
            </p>
          </div>
        </section>
      </div>
    );
  }

  /* ------------------------------------------------------------ detail */
  return (
    <div className="animate-rise-in">
      <BackButton onClick={onBack} />

      <section className="overflow-hidden rounded-[28px] border-2 border-[#0e0e0e] bg-white shadow-[6px_6px_0_rgba(14,14,14,0.12)]">
        {/* ---------- Header: title + section progress ---------- */}
        <div className="flex flex-col gap-6 border-b border-black/10 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div className="min-w-0">
            <span className="inline-block rounded-md bg-[#f8dc03] px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#0e0e0e]">
              {career.category}
            </span>

            <h1
              ref={headingRef}
              tabIndex={-1}
              className="mt-4 text-3xl font-extrabold tracking-[-0.04em] outline-none sm:text-4xl lg:text-[42px] lg:leading-[1.05]"
            >
              {curriculum.headline}
            </h1>

            <p className="mt-2 text-sm text-[#5a5f58] sm:text-base">
              {curriculum.subtitle}
            </p>

            <p className="mt-1 text-sm text-[#8a8f88]">
              {lectureCount} lectures · {formatContentDuration(contentSeconds)}{" "}
              of content
            </p>
          </div>

          <div className="w-full shrink-0 lg:w-[340px]">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="font-semibold text-[#0e0e0e]">
                {completedCount} of {sections.length} sections complete
              </span>
              <span className="tabular-nums text-[#5a5f58]">{percent}%</span>
            </div>

            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full border border-black/10 bg-[#e9e9e4]">
              <div
                className="h-full rounded-full bg-[#f8dc03] transition-[width] duration-700 ease-out motion-reduce:transition-none"
                style={{ width: barReady ? `${percent}%` : "0%" }}
              />
            </div>

            {syncNote && (
              <p className="mt-2 text-xs text-[#8a8f88]">{syncNote}</p>
            )}
          </div>
        </div>

        {/* ---------- Course content bar ---------- */}
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-6 pt-6 sm:px-8 sm:pt-7">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="text-xl font-extrabold tracking-[-0.025em] sm:text-2xl">
              Course content
            </h2>
            <p className="text-sm text-[#5a5f58]">
              {curriculumSummary(curriculum)}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setOpenIds(allOpen ? [] : sections.map((section) => section.id))
            }
            className="cursor-pointer text-sm font-semibold text-[#0e0e0e] underline decoration-[#f8dc03] decoration-2 underline-offset-4 transition hover:decoration-[#1ed2f4]"
          >
            {allOpen ? "Collapse all" : "Expand all"}
          </button>
        </div>

        {/* ---------- Section accordion ---------- */}
        <div className="p-4 sm:p-6 sm:px-8">
          <ul className="overflow-hidden rounded-2xl border border-black/10 bg-[#f6f7f4]">
            {sections.map((section, index) => {
              const open = openIds.includes(section.id);
              const sectionProgress = progress[section.id];
              const status = watchedLabel(section, sectionProgress);
              const meta = sectionMeta(section);

              // "Resume" sits on the first half-watched lecture; a fresh
              // module offers "Start" on its first lecture instead.
              const watchedFlags = sectionProgress?.watched ?? [];
              const anyWatched = watchedFlags.some(Boolean);
              const firstUnwatched = watchedFlags.findIndex(
                (flag) => !flag,
              );
              const resumeIndex = anyWatched ? firstUnwatched : -1;
              const startIndex = anyWatched ? -1 : 0;

              return (
                <li
                  key={section.id}
                  id={`section-${section.id}`}
                  className="animate-rise-in border-b border-black/[0.08] last:border-b-0"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <div className="group relative transition-colors hover:bg-white">
                    {/* Gold edge: shows the row you are on / have opened. */}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute left-0 top-0 h-full w-[3px] origin-left bg-[#f8dc03] transition-transform duration-300",
                        open
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100",
                      )}
                    />

                    <button
                      type="button"
                      onClick={() => toggleOpen(section.id)}
                      aria-expanded={open}
                      aria-controls={`${section.id}-panel`}
                      className="flex w-full cursor-pointer items-center gap-3 px-4 py-4 text-left sm:gap-4 sm:px-5"
                    >
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 shrink-0 text-[#5a5f58] transition-transform duration-300 group-hover:text-[#0e0e0e]",
                          open && "rotate-180 text-[#0e0e0e]",
                        )}
                      />

                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] font-bold leading-snug tracking-[-0.01em] text-[#0e0e0e] sm:text-base">
                          {section.title}
                        </span>

                        {/* Status + meta under the title on small screens. */}
                        <span className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 md:hidden">
                          <StatusTag label={status} />
                          <span className="text-xs text-[#5a5f58]">{meta}</span>
                        </span>
                      </span>

                      <span className="hidden w-[170px] shrink-0 justify-end md:flex">
                        <StatusTag label={status} />
                      </span>

                      <span className="hidden w-[150px] shrink-0 text-right text-sm text-[#5a5f58] md:block">
                        {meta}
                      </span>
                    </button>

                    {/* ---------- Expanded panel ---------- */}
                    <div
                      id={`${section.id}-panel`}
                      inert={!open}
                      className={cn(
                        "grid transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none",
                        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                      )}
                    >
                      <div className="overflow-hidden">
                        <div className="bg-white px-3 pb-5 pt-2 sm:px-5 sm:pt-3">
                          <ul>
                            {section.lectures.map((lecture, lectureIndex) => {
                              const watched =
                                sectionProgress?.watched[lectureIndex] ??
                                false;
                              const noteOpen =
                                openLectures[lecture.id] ?? true;

                              const action = watched ? (
                                <WatchedTag label="Watched" />
                              ) : lectureIndex === resumeIndex ? (
                                <LectureAction
                                  label="Resume"
                                  inProgress
                                  onClick={() =>
                                    toggleLecture(section.id, lectureIndex)
                                  }
                                />
                              ) : lectureIndex === startIndex ? (
                                <LectureAction
                                  label="Start"
                                  onClick={() =>
                                    toggleLecture(section.id, lectureIndex)
                                  }
                                />
                              ) : null;

                              return (
                                <li
                                  key={lecture.id}
                                  className="flex items-start gap-3 px-1 py-4 transition-colors hover:bg-[#f9fff6] sm:gap-4 sm:px-2"
                                >
                                  <span
                                    aria-hidden
                                    className="mt-0.5 shrink-0 text-[#5a5f58]"
                                  >
                                    <SquarePlay className="h-5 w-5" />
                                  </span>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-5">
                                      <span className="flex min-w-0 items-start gap-1">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            toggleLecture(
                                              section.id,
                                              lectureIndex,
                                            )
                                          }
                                          title={
                                            watched
                                              ? "Mark as not watched"
                                              : "Mark as watched"
                                          }
                                          className="min-w-0 cursor-pointer text-left text-[15px] font-bold leading-snug tracking-[-0.01em] text-[#0e0e0e] underline-offset-4 transition hover:underline hover:decoration-[#f8dc03]"
                                        >
                                          {lecture.title}
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() =>
                                            toggleLectureNote(lecture.id)
                                          }
                                          aria-expanded={noteOpen}
                                          aria-controls={`${lecture.id}-note`}
                                          aria-label={
                                            noteOpen
                                              ? `Hide details for ${lecture.title}`
                                              : `Show details for ${lecture.title}`
                                          }
                                          className="-ml-0.5 mt-0.5 shrink-0 cursor-pointer rounded-md p-1 text-[#8a8f88] transition hover:bg-black/5 hover:text-[#0e0e0e]"
                                        >
                                          <ChevronUp
                                            className={cn(
                                              "h-4 w-4 transition-transform duration-300",
                                              !noteOpen && "rotate-180",
                                            )}
                                          />
                                        </button>
                                      </span>

                                      <span className="shrink-0 sm:pt-0.5">
                                        {action}
                                      </span>
                                    </div>

                                    <div
                                      id={`${lecture.id}-note`}
                                      className={cn(
                                        "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
                                        noteOpen
                                          ? "grid-rows-[1fr]"
                                          : "grid-rows-[0fr]",
                                      )}
                                    >
                                      <div className="overflow-hidden">
                                        <p className="mt-1.5 max-w-3xl text-sm leading-6 text-[#5a5f58]">
                                          {lecture.description}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              );
                            })}

                            {section.quiz && (
                              <li>
                                <button
                                  type="button"
                                  onClick={() => toggleQuiz(section.id)}
                                  title={
                                    sectionProgress?.quizDone
                                      ? "Mark quiz as not taken"
                                      : "Mark quiz as taken"
                                  }
                                  className="flex w-full cursor-pointer items-center gap-3 px-1 py-4 text-left transition hover:bg-[#f9fff6] sm:gap-4 sm:px-2"
                                >
                                  <span
                                    aria-hidden
                                    className="mt-0.5 shrink-0 text-[#5a5f58]"
                                  >
                                    <Lightbulb className="h-5 w-5" />
                                  </span>

                                  <span className="min-w-0 flex-1 text-[15px] font-bold tracking-[-0.01em] text-[#0e0e0e]">
                                    {section.quiz.title}
                                  </span>

                                  {sectionProgress?.quizDone && (
                                    <WatchedTag label="Completed" />
                                  )}

                                  <span className="shrink-0 text-sm text-[#5a5f58]">
                                    {section.quiz.questions} questions
                                  </span>
                                </button>
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ---------- Footer / resume ---------- */}
        <div className="flex flex-col gap-4 border-t border-black/10 bg-[#f6f7f4] p-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#0e0e0e]">
              {nextSection
                ? `Up next: ${nextSection.title}`
                : "Every section is complete — nice work."}
            </p>
            <p className="mt-0.5 text-sm text-[#5a5f58]">
              {nextSection
                ? "Your progress is saved as you go."
                : "Retake any quiz any time from the list above."}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-3">
            <button
              type="button"
              onClick={resume}
              disabled={!nextSection}
              className="inline-flex h-11 cursor-pointer items-center rounded-full bg-[#f8dc03] px-6 text-sm font-semibold text-[#0e0e0e] transition hover:bg-[#ffe14a] disabled:cursor-not-allowed disabled:bg-[#e9e9e4] disabled:text-[#8a8f88]"
            >
              {nextSection ? "Resume learning" : "Completed"}
            </button>

            <button
              type="button"
              onClick={onBack}
              className="inline-flex h-11 cursor-pointer items-center rounded-full border border-[#0e0e0e]/15 bg-white px-6 text-sm font-medium text-[#0e0e0e] transition hover:border-[#0e0e0e]"
            >
              Browse careers
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group mb-5 inline-flex cursor-pointer items-center gap-2 rounded-full border border-black/10 bg-white py-2 pl-3 pr-4 text-sm font-semibold text-[#0e0e0e] transition hover:border-[#0e0e0e] hover:bg-[#f8dc03]"
    >
      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
      All careers
    </button>
  );
}
