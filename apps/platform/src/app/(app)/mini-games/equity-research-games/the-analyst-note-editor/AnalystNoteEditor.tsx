"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

import { useEntryEnterShortcut } from "@/app/(app)/mini-games/vc-games/_lib/use-entry-enter-shortcut";
import { MiniGameShell } from "@/components/mini-games/MiniGameShell";
import { useMiniGameResultSync } from "@/components/mini-games/use-mini-game-result-sync";

import { AnalystNoteIntro } from "./_components/AnalystNoteIntro";
import { AnalystNoteResult } from "./_components/AnalystNoteResult";
import { NoteDocument } from "./_components/NoteDocument";
import { ANALYST_NOTE_SCENARIOS } from "./_data/analyst-note-scenarios";
import {
  ANALYST_NOTE_STORAGE_KEY,
  ANALYST_NOTE_STORAGE_VERSION,
  INITIAL_ANALYST_NOTE_STATE,
  analystNoteReducer,
  parseAnalystNotePersistence,
} from "./_lib/analyst-note-state";
import {
  markAnalystNoteScenarioSeen,
  selectAnalystNoteScenario,
} from "./_lib/select-analyst-note-scenario";
import styles from "./analyst-note-editor.module.css";

export function AnalystNoteEditor() {
  const [state, dispatch] = useReducer(
    analystNoteReducer,
    INITIAL_ANALYST_NOTE_STATE,
  );
  const [hasHydrated, setHasHydrated] = useState(false);
  const reviewHeadingRef = useRef<HTMLHeadingElement>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- one-time localStorage hydration */
    try {
      const raw = window.localStorage.getItem(ANALYST_NOTE_STORAGE_KEY);
      const saved = raw ? parseAnalystNotePersistence(JSON.parse(raw)) : null;
      if (saved) dispatch({ type: "HYDRATE", payload: saved });
    } catch {
      // Persistence is optional; rotation remains available in memory.
    }
    setHasHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    try {
      window.localStorage.setItem(
        ANALYST_NOTE_STORAGE_KEY,
        JSON.stringify({
          version: ANALYST_NOTE_STORAGE_VERSION,
          seenScenarioIds: state.seenScenarioIds,
        }),
      );
    } catch {
      // Persistence is optional; rotation remains available in memory.
    }
  }, [hasHydrated, state.seenScenarioIds]);

  useEffect(() => {
    const target =
      state.phase === "reviewing"
        ? reviewHeadingRef.current
        : state.phase === "result"
          ? resultHeadingRef.current
          : null;
    if (!target) return;
    const frame = window.requestAnimationFrame(() => {
      target.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [state.phase, state.sessionKey]);

  // Report the finished run to /api/mini-games/progress (idempotent per run).
  const syncResult = useMiniGameResultSync();

  useEffect(() => {
    if (state.phase !== "result" || !state.resultSnapshot) return;
    const lines = state.resultSnapshot.lines;
    const matched = lines.filter((line) => line.matched).length;
    syncResult({
      score: lines.length > 0 ? Math.round((matched / lines.length) * 100) : null,
      outcome:
        lines.length > 0 && matched === lines.length
          ? "all-lines-matched"
          : "partial-lines-matched",
      completed: true,
    });
  }, [state.phase, state.resultSnapshot, syncResult]);

  const startSession = useCallback(() => {
    dispatch({
      type: "START",
      scenario: selectAnalystNoteScenario(
        ANALYST_NOTE_SCENARIOS,
        state.seenScenarioIds,
      ),
    });
  }, [state.seenScenarioIds]);

  useEntryEnterShortcut(
    hasHydrated && state.phase === "ready",
    startSession,
  );

  const flaggedLineIds = useMemo(
    () => new Set(state.flaggedLineIds),
    [state.flaggedLineIds],
  );

  const toggleLine = useCallback((lineId: string) => {
    dispatch({ type: "TOGGLE_LINE", lineId });
  }, []);

  const submitReview = useCallback(() => {
    if (state.phase !== "reviewing" || !state.activeScenario) return;
    dispatch({
      type: "SUBMIT",
      seenScenarioIds: markAnalystNoteScenarioSeen(
        ANALYST_NOTE_SCENARIOS,
        state.seenScenarioIds,
        state.activeScenario.id,
      ),
    });
  }, [state.activeScenario, state.phase, state.seenScenarioIds]);

  return (
    <MiniGameShell
      gameLabel="The Analyst Note Editor"
      hubHref="/mini-games/equity-research-games"
      backLabel="Equity Research Games"
      rightContent={
        state.phase === "reviewing" ? (
          <p className={styles.shellStatus}>Draft review</p>
        ) : state.phase === "result" ? (
          <p className={styles.shellStatus}>Editorial record</p>
        ) : null
      }
    >
      {state.phase === "ready" ? (
        <AnalystNoteIntro isReady={hasHydrated} onStart={startSession} />
      ) : null}

      {state.phase === "reviewing" && state.activeScenario ? (
        <NoteDocument
          scenario={state.activeScenario}
          flaggedLineIds={flaggedLineIds}
          headingRef={reviewHeadingRef}
          onToggle={toggleLine}
          onSubmit={submitReview}
        />
      ) : null}

      {state.phase === "result" && state.resultSnapshot ? (
        <AnalystNoteResult
          snapshot={state.resultSnapshot}
          headingRef={resultHeadingRef}
          onTryAnother={startSession}
        />
      ) : null}
    </MiniGameShell>
  );
}
