"use client";

import { useEffect, useReducer, useRef, useState } from "react";

import { useMiniGameResultSync } from "@/components/mini-games/use-mini-game-result-sync";

import { VcGameShell } from "../_components/VcGameShell";
import { FounderInterrogationIntro } from "./_components/FounderInterrogationIntro";
import { PitchLibrary } from "./_components/PitchLibrary";
import { PitchPlayer } from "./_components/PitchPlayer";
import { PitchReveal } from "./_components/PitchReveal";
import { FOUNDER_PITCH_VIDEOS } from "./_data/founder-pitch-videos";
import {
  FOUNDER_INTERROGATION_STORAGE_KEY,
  FOUNDER_INTERROGATION_STORAGE_VERSION,
  founderInterrogationReducer,
  INITIAL_FOUNDER_INTERROGATION_STATE,
  parseFounderInterrogationPersistence,
} from "./_lib/founder-interrogation-state";
import styles from "./founder-interrogation.module.css";

export function FounderInterrogation() {
  const [state, dispatch] = useReducer(
    founderInterrogationReducer,
    INITIAL_FOUNDER_INTERROGATION_STATE,
  );
  const [hasHydrated, setHasHydrated] = useState(false);
  const decisionHeadingRef = useRef<HTMLHeadingElement>(null);
  const revealHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- one-time localStorage hydration */
    try {
      const raw = window.localStorage.getItem(FOUNDER_INTERROGATION_STORAGE_KEY);
      const saved = raw ? parseFounderInterrogationPersistence(JSON.parse(raw)) : null;
      if (saved) dispatch({ type: "HYDRATE", payload: saved });
    } catch {
      // Persistence is optional; the game remains playable without it.
    }
    setHasHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    try {
      window.localStorage.setItem(
        FOUNDER_INTERROGATION_STORAGE_KEY,
        JSON.stringify({
          version: FOUNDER_INTERROGATION_STORAGE_VERSION,
          watchedPitchIds: state.watchedPitchIds,
        }),
      );
    } catch {
      // Persistence is optional; the game remains playable without it.
    }
  }, [hasHydrated, state.watchedPitchIds]);

  useEffect(() => {
    if (state.phase === "decision-ready") decisionHeadingRef.current?.focus();
    if (state.phase === "reveal") revealHeadingRef.current?.focus();
  }, [state.phase]);

  // Report the finished run to /api/mini-games/progress (idempotent per run).
  const syncResult = useMiniGameResultSync();

  useEffect(() => {
    if (state.phase !== "reveal" || !state.decision) return;
    syncResult({
      outcome: state.decision === "accept" ? "pitch-accepted" : "pitch-rejected",
      completed: true,
    });
  }, [state.phase, state.decision, syncResult]);

  const activePitchIndex = FOUNDER_PITCH_VIDEOS.findIndex(
    (pitch) => pitch.id === state.activePitchId,
  );
  const activePitch = activePitchIndex >= 0 ? FOUNDER_PITCH_VIDEOS[activePitchIndex] : null;
  const pitchLabel = activePitchIndex >= 0
    ? `Pitch ${String(activePitchIndex + 1).padStart(2, "0")}`
    : "Anonymous pitch";
  const isInsidePitch =
    state.phase === "watching" || state.phase === "decision-ready" || state.phase === "reveal";
  const isInLibrary = state.phase === "hub";
  const backToVideos = () => dispatch({ type: "BACK_TO_VIDEOS" });

  return (
    <VcGameShell
      gameLabel="Founder Interrogation"
      backLabel={isInsidePitch ? "Back to Videos" : isInLibrary ? "Game Intro" : "The Deal Room"}
      onBack={
        isInsidePitch
          ? backToVideos
          : isInLibrary
            ? () => dispatch({ type: "BACK_TO_INTRO" })
            : undefined
      }
      rightContent={<p className={styles.modeLabel}>VC view · anonymous pitches</p>}
    >
      {state.phase === "intro" ? (
        <FounderInterrogationIntro onStart={() => dispatch({ type: "ENTER_LIBRARY" })} />
      ) : null}

      {state.phase === "hub" ? (
        <PitchLibrary
          pitches={FOUNDER_PITCH_VIDEOS}
          watchedPitchIds={state.watchedPitchIds}
          onOpen={(pitchId) => dispatch({ type: "OPEN_PITCH", pitchId })}
        />
      ) : null}

      {activePitch && (state.phase === "watching" || state.phase === "decision-ready") ? (
        <PitchPlayer
          ref={decisionHeadingRef}
          pitch={activePitch}
          pitchLabel={pitchLabel}
          isDecisionReady={state.phase === "decision-ready"}
          onDecisionReady={() => dispatch({ type: "MAKE_DECISION_READY" })}
          onDecide={(decision) => dispatch({ type: "DECIDE", decision })}
        />
      ) : null}

      {activePitch && state.phase === "reveal" && state.decision ? (
        <PitchReveal
          ref={revealHeadingRef}
          pitch={activePitch}
          decision={state.decision}
          onBackToVideos={backToVideos}
        />
      ) : null}
    </VcGameShell>
  );
}
