"use client";

import Image from "next/image";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";

import { useMiniGameResultSync } from "@/components/mini-games/use-mini-game-result-sync";

import { CountdownBar } from "../_components/CountdownBar";
import { DecisionControls } from "../_components/DecisionControls";
import { VcGameShell } from "../_components/VcGameShell";
import { VcPrimaryButton } from "../_components/VcPrimaryButton";
import type { VcDecisionOption } from "../_lib/decision-controls";
import { useEntryEnterShortcut } from "../_lib/use-entry-enter-shortcut";
import { PitchReveal } from "./_components/PitchReveal";
import { PITCH_SETS } from "./_data/pitch-sets";
import {
  INITIAL_PITCH_SPRINT_STATE,
  PITCH_SPRINT_STORAGE_KEY,
  PITCH_SPRINT_STORAGE_VERSION,
  getPitchSprintComparison,
  parsePitchSprintPersistence,
  pitchSprintReducer,
  type PitchChoice,
} from "./_lib/pitch-sprint-state";
import { selectPitchSet, shufflePitchSetCards } from "./_lib/select-pitch-set";
import styles from "./the-pitch-sprint.module.css";

const DECISION_TIME_MS = 18_000;
const DECISION_FLASH_MS = 400;
const PITCH_SPRINT_DECISIONS: readonly VcDecisionOption[] = [
  { choice: "pass", label: "Decline", shortcuts: ["←", "A"] },
  { choice: "fund", label: "Invest", shortcuts: ["→", "D"] },
];

function getPitchSprintDecisionFromKey(key: string): PitchChoice | undefined {
  const normalizedKey = key.toLowerCase();
  if (normalizedKey === "arrowleft" || normalizedKey === "a") return "pass";
  if (normalizedKey === "arrowright" || normalizedKey === "d") return "fund";
  return undefined;
}

export function ThePitchSprint() {
  const [state, dispatch] = useReducer(pitchSprintReducer, INITIAL_PITCH_SPRINT_STATE);
  const [hasHydrated, setHasHydrated] = useState(false);
  const decisionLockedRef = useRef(false);
  const activeCardIdRef = useRef<string | null>(null);
  const cardStartedAtRef = useRef(0);
  const advanceTimerRef = useRef<number | null>(null);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- one-time localStorage hydration */
    try {
      const raw = window.localStorage.getItem(PITCH_SPRINT_STORAGE_KEY);
      const saved = raw ? parsePitchSprintPersistence(JSON.parse(raw)) : null;
      if (saved) dispatch({ type: "HYDRATE", payload: saved });
    } catch {
      // Storage is optional; the sprint still works without it.
    }
    setHasHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;

    try {
      window.localStorage.setItem(
        PITCH_SPRINT_STORAGE_KEY,
        JSON.stringify({
          version: PITCH_SPRINT_STORAGE_VERSION,
          lastSetId: state.lastSetId,
        }),
      );
    } catch {
      // Storage is optional; the sprint still works without it.
    }
  }, [hasHydrated, state.lastSetId]);

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current !== null) {
        window.clearTimeout(advanceTimerRef.current);
      }
    };
  }, []);

  // Report the finished run to /api/mini-games/progress (idempotent per run).
  const syncResult = useMiniGameResultSync();

  useEffect(() => {
    if (state.phase !== "reveal" || !state.activeSet) return;
    const { cards } = state.activeSet;
    const matched = state.decisions.filter((decision) =>
      cards.some(
        (card) => card.id === decision.cardId && card.referenceDecision === decision.choice,
      ),
    ).length;
    const total = state.decisions.length;
    syncResult({
      score: total > 0 ? Math.round((matched / total) * 100) : null,
      outcome: total > 0 && matched === total ? "matched-history" : "partial-history-match",
      completed: true,
    });
  }, [state.phase, state.activeSet, state.decisions, syncResult]);

  const resolveChoice = useCallback((choice: PitchChoice, timedOut = false) => {
    if (decisionLockedRef.current || !activeCardIdRef.current) return;

    decisionLockedRef.current = true;
    const elapsedMs = Math.max(0, performance.now() - cardStartedAtRef.current);
    dispatch({
      type: "RESOLVE_CARD",
      cardId: activeCardIdRef.current,
      choice,
      timedOut,
      responseTimeMs: timedOut
        ? DECISION_TIME_MS
        : Math.round(Math.min(elapsedMs, DECISION_TIME_MS)),
    });

    advanceTimerRef.current = window.setTimeout(() => {
      decisionLockedRef.current = false;
      dispatch({ type: "ADVANCE" });
    }, DECISION_FLASH_MS);
  }, []);

  useEffect(() => {
    if (state.phase !== "playing" || state.selectedChoice !== null || !state.activeSet) return;

    decisionLockedRef.current = false;
    activeCardIdRef.current = state.activeSet.cards[state.currentIndex]?.id ?? null;
    cardStartedAtRef.current = performance.now();
    const decisionTimer = window.setTimeout(() => resolveChoice("pass", true), DECISION_TIME_MS);

    return () => window.clearTimeout(decisionTimer);
  }, [resolveChoice, state.activeSet, state.currentIndex, state.phase, state.selectedChoice]);

  useEffect(() => {
    if (state.phase !== "playing" || state.selectedChoice !== null) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;

      const choice = getPitchSprintDecisionFromKey(event.key);
      if (!choice) return;

      event.preventDefault();
      resolveChoice(choice);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [resolveChoice, state.phase, state.selectedChoice]);

  const startSprint = useCallback(() => {
    if (advanceTimerRef.current !== null) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }

    decisionLockedRef.current = false;
    activeCardIdRef.current = null;
    const selectedSet = selectPitchSet(PITCH_SETS, state.lastSetId);
    dispatch({ type: "START_SPRINT", pitchSet: shufflePitchSetCards(selectedSet) });
  }, [state.lastSetId]);

  useEntryEnterShortcut(state.phase === "ready", startSprint);

  const currentCard = state.activeSet?.cards[state.currentIndex];
  const comparison = state.activeSet
    ? getPitchSprintComparison(state.activeSet, state.decisions)
    : null;
  const manualDecisionsMade = state.decisions.filter((decision) => !decision.timedOut).length;

  return (
    <VcGameShell
      gameLabel="The Pitch Sprint"
      rightContent={<p className={styles.setLabel}>5-card set</p>}
    >

      {state.phase === "ready" ? (
        <section className={styles.introPanel} aria-labelledby="pitch-sprint-title">
          <div className={styles.introMotif} aria-hidden="true">
            <Image
              src="/images/vc-games/the-pitch-sprint.png"
              alt=""
              fill
              sizes="190px"
              priority
            />
          </div>

          <div className={styles.introContent}>
            <p className={styles.eyebrow}>Anonymous pitch screening</p>
            <h1 id="pitch-sprint-title">Can you spot the company?</h1>

            <div className={styles.introDetails}>
              <p className={styles.mechanicLine}>5 anonymous pitches · 18 seconds each</p>
              <p className={styles.introCopy}>Invest or decline before the pitch moves on.</p>
              <p className={styles.revealLine}>Real identities unlock after all five calls.</p>
            </div>

            <div className={styles.introActions}>
              <div className={styles.introShortcuts} aria-label="Keyboard shortcuts">
                <span><kbd>A</kbd> Decline</span>
                <span><kbd>D</kbd> Invest</span>
              </div>
              <p className={styles.inputHint}>Click or use keyboard</p>
              <VcPrimaryButton
                beam
                beamColor="#f8dc03"
                className={styles.startButton}
                onClick={startSprint}
              >
                Start Sprint
              </VcPrimaryButton>
            </div>
          </div>
        </section>
      ) : null}

      {state.phase === "playing" && currentCard ? (
        <section className={styles.playPanel} aria-labelledby="current-pitch-name">
          <div className={styles.roundMeta}>
            <p>
              Pitch <strong>{state.currentIndex + 1}</strong> / 5
            </p>
            <p>
              Decisions made <strong>{manualDecisionsMade}</strong>
            </p>
          </div>

          <CountdownBar
            durationMs={DECISION_TIME_MS}
            restartKey={currentCard.id}
            stopped={state.selectedChoice !== null}
            label="Eighteen-second pitch timer"
            emphasizeReset
          />

          <div
            key={currentCard.id}
            className={`${styles.pitchArea} ${state.selectedChoice !== null ? styles.pitchExiting : ""}`}
          >
            <p className={styles.pitchPrompt}>Anonymous company</p>
            <h1 id="current-pitch-name">{currentCard.fictionalName}</h1>
            <p className={styles.description}>{currentCard.description}</p>
            <ul className={styles.statChips} aria-label="Company facts">
              {currentCard.stats.map((stat) => (
                <li key={stat}>{stat}</li>
              ))}
            </ul>
          </div>

          <DecisionControls
            selectedChoice={state.selectedChoice}
            onChoose={(choice) => {
              if (choice !== "maybe") resolveChoice(choice);
            }}
            ariaLabel={`Decision for ${currentCard.fictionalName}`}
            decisions={PITCH_SPRINT_DECISIONS}
            variant="rapid"
          />

          <p className={styles.keyHelper}>Keys: ← / → &nbsp;or&nbsp; A / D</p>

          <p className={styles.feedback} aria-live="polite">
            {state.selectedChoice
              ? state.resolvedByTimeout
                ? "Time expired — resolved as Decline"
                : `${state.selectedChoice === "fund" ? "Invest" : "Decline"} selected`
              : "\u00A0"}
          </p>
        </section>
      ) : null}

      {state.phase === "reveal" && state.activeSet && comparison ? (
        <PitchReveal
          pitchSet={state.activeSet}
          decisions={state.decisions}
          comparison={comparison}
          onPlayAgain={startSprint}
        />
      ) : null}
    </VcGameShell>
  );
}
