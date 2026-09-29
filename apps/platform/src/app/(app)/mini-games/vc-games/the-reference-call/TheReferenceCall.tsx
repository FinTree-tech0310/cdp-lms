"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";

import { useMiniGameResultSync } from "@/components/mini-games/use-mini-game-result-sync";

import { VcGameShell } from "../_components/VcGameShell";
import { selectUnseenItem, updateSeenItemIds } from "../_lib/select-unseen-item";
import { useEntryEnterShortcut } from "../_lib/use-entry-enter-shortcut";
import { FounderPitchResults } from "./_components/FounderPitchResults";
import { LiveTranscript } from "./_components/LiveTranscript";
import { ModeSelection } from "./_components/ModeSelection";
import { ReferenceCallResults } from "./_components/ReferenceCallResults";
import { FOUNDER_PITCH_TRANSCRIPTS } from "./_data/founder-pitch-transcripts";
import { REFERENCE_CALL_TRANSCRIPTS } from "./_data/reference-call-transcripts";
import { INITIAL_REFERENCE_CALL_STATE, LINE_DURATION_MS, parseReferenceCallPersistence, REFERENCE_CALL_STORAGE_KEY, REFERENCE_CALL_STORAGE_VERSION, referenceCallReducer } from "./_lib/reference-call-state";
import styles from "./the-reference-call.module.css";

export function TheReferenceCall() {
  const [state, dispatch] = useReducer(referenceCallReducer, INITIAL_REFERENCE_CALL_STATE);
  const [hasHydrated, setHasHydrated] = useState(false);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- one-time localStorage hydration */
    let seenReferenceCallIds: string[] = [];
    let seenFounderPitchIds: string[] = [];
    try {
      const raw = window.localStorage.getItem(REFERENCE_CALL_STORAGE_KEY);
      const saved = raw ? parseReferenceCallPersistence(JSON.parse(raw)) : null;
      if (saved) ({ seenReferenceCallIds, seenFounderPitchIds } = saved);
    } catch { /* Persistence is optional. */ }
    dispatch({ type: "PREPARE_MODES", reference: selectUnseenItem(REFERENCE_CALL_TRANSCRIPTS, seenReferenceCallIds, "Reference Call requires content."), pitch: selectUnseenItem(FOUNDER_PITCH_TRANSCRIPTS, seenFounderPitchIds, "Founder Pitch requires content."), seenReferenceCallIds, seenFounderPitchIds });
    setHasHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    try { window.localStorage.setItem(REFERENCE_CALL_STORAGE_KEY, JSON.stringify({ version: REFERENCE_CALL_STORAGE_VERSION, seenReferenceCallIds: state.seenReferenceCallIds, seenFounderPitchIds: state.seenFounderPitchIds })); } catch { /* Persistence is optional. */ }
  }, [hasHydrated, state.seenFounderPitchIds, state.seenReferenceCallIds]);

  useEffect(() => {
    if (state.phase !== "live") return;
    const timeoutId = window.setTimeout(() => dispatch({ type: "ADVANCE" }), LINE_DURATION_MS);
    return () => window.clearTimeout(timeoutId);
  }, [state.activeLineIndex, state.activeMode, state.phase]);

  useEffect(() => {
    if (state.phase !== "live" || !state.activeMode) return;
    const transcript = state.activeMode === "reference-call"
      ? state.preparedReference
      : state.preparedPitch;
    const activeLine = transcript?.lines[state.activeLineIndex];
    if (!activeLine) return;

    const handleShortcut = (event: KeyboardEvent) => {
      if (event.repeat || event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
      ) {
        return;
      }

      const key = event.key.toLowerCase();
      if (key === "n" || event.key === "ArrowRight") {
        event.preventDefault();
        dispatch({ type: "ADVANCE" });
        return;
      }
      if (state.activeMode === "reference-call" && key === "f" && activeLine.speaker === "Reference") {
        event.preventDefault();
        dispatch({ type: "FLAG_ACTIVE_LINE", lineId: activeLine.id });
      }
      if (state.activeMode === "founder-pitch" && activeLine.speaker === "Founder") {
        if (key === "g" || key === "r") {
          event.preventDefault();
          dispatch({ type: "JUDGE_ACTIVE_LINE", lineId: activeLine.id, judgment: key === "g" ? "green" : "red" });
        }
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [state.activeLineIndex, state.activeMode, state.phase, state.preparedPitch, state.preparedReference]);

  useEffect(() => { if (state.phase === "results") resultsHeadingRef.current?.focus(); }, [state.phase]);

  // Report the finished run to /api/mini-games/progress (idempotent per run).
  const syncResult = useMiniGameResultSync();

  useEffect(() => {
    if (state.phase !== "results") return;
    if (state.activeMode === "reference-call" && state.preparedReference) {
      const redFlags = state.preparedReference.lines.filter((line) => line.isRedFlag);
      const caught = redFlags.filter((line) => state.flaggedLineIds.includes(line.id)).length;
      syncResult({
        score: redFlags.length > 0 ? Math.round((caught / redFlags.length) * 100) : null,
        outcome: "reference-call",
        completed: true,
      });
      return;
    }
    if (state.activeMode === "founder-pitch" && state.preparedPitch) {
      const signals = state.preparedPitch.lines.filter((line) => line.signalType !== "neutral");
      const correct = signals.filter((line) => state.pitchJudgments[line.id] === line.signalType).length;
      syncResult({
        score: signals.length > 0 ? Math.round((correct / signals.length) * 100) : null,
        outcome: "founder-pitch",
        completed: true,
      });
    }
  }, [state.phase, state.activeMode, state.flaggedLineIds, state.pitchJudgments, state.preparedPitch, state.preparedReference, syncResult]);

  const startReference = useCallback(() => {
    if (!state.preparedReference) return;
    dispatch({ type: "START_REFERENCE", seenReferenceCallIds: updateSeenItemIds(state.seenReferenceCallIds, state.preparedReference.id, REFERENCE_CALL_TRANSCRIPTS.length) });
  }, [state.preparedReference, state.seenReferenceCallIds]);

  const startPitch = useCallback(() => {
    if (!state.preparedPitch) return;
    dispatch({ type: "START_PITCH", seenFounderPitchIds: updateSeenItemIds(state.seenFounderPitchIds, state.preparedPitch.id, FOUNDER_PITCH_TRANSCRIPTS.length) });
  }, [state.preparedPitch, state.seenFounderPitchIds]);

  useEntryEnterShortcut(
    state.phase === "mode-selection"
      && Boolean(state.preparedReference)
      && Boolean(state.preparedPitch),
    startReference,
  );

  const returnToModes = useCallback((advanceCompleted = false) => {
    if (advanceCompleted && state.activeMode === "reference-call") {
      dispatch({ type: "RETURN_TO_MODES", reference: selectUnseenItem(REFERENCE_CALL_TRANSCRIPTS, state.seenReferenceCallIds, "Reference Call requires content.") });
    } else if (advanceCompleted && state.activeMode === "founder-pitch") {
      dispatch({ type: "RETURN_TO_MODES", pitch: selectUnseenItem(FOUNDER_PITCH_TRANSCRIPTS, state.seenFounderPitchIds, "Founder Pitch requires content.") });
    } else dispatch({ type: "RETURN_TO_MODES" });
  }, [state.activeMode, state.seenFounderPitchIds, state.seenReferenceCallIds]);

  const activeTranscript = state.activeMode === "reference-call" ? state.preparedReference : state.activeMode === "founder-pitch" ? state.preparedPitch : null;
  const inMode = state.phase !== "mode-selection";

  return (
    <VcGameShell gameLabel="The Reference Call" backLabel={inMode ? "Choose Mode" : "The Deal Room"} onBack={inMode ? () => returnToModes(false) : undefined} rightContent={inMode ? <button type="button" className={styles.shellSwitchButton} onClick={() => returnToModes(false)}>Switch Mode</button> : <p className={styles.modeLabel}>Two listening modes</p>}>
      {state.phase === "mode-selection" && state.preparedReference && state.preparedPitch ? <ModeSelection reference={state.preparedReference} pitch={state.preparedPitch} onStartReference={startReference} onStartPitch={startPitch} /> : null}
      {state.phase === "mode-selection" && (!state.preparedReference || !state.preparedPitch) ? <section className={styles.introPanel} aria-busy="true"><p className={styles.eyebrow}>Preparing conversations</p></section> : null}
      {state.phase === "live" && activeTranscript && state.activeMode ? <LiveTranscript mode={state.activeMode} transcript={activeTranscript} activeLineIndex={state.activeLineIndex} flaggedLineIds={state.flaggedLineIds} pitchJudgments={state.pitchJudgments} onFlag={(lineId) => dispatch({ type: "FLAG_ACTIVE_LINE", lineId })} onJudge={(lineId, judgment) => dispatch({ type: "JUDGE_ACTIVE_LINE", lineId, judgment })} onAdvance={() => dispatch({ type: "ADVANCE" })} /> : null}
      {state.phase === "results" && state.activeMode === "reference-call" && state.preparedReference ? <ReferenceCallResults ref={resultsHeadingRef} transcript={state.preparedReference} flaggedLineIds={state.flaggedLineIds} onTryAnother={() => returnToModes(true)} /> : null}
      {state.phase === "results" && state.activeMode === "founder-pitch" && state.preparedPitch ? <FounderPitchResults ref={resultsHeadingRef} transcript={state.preparedPitch} judgments={state.pitchJudgments} onTryAnother={() => returnToModes(true)} /> : null}
    </VcGameShell>
  );
}
