"use client";

import Image from "next/image";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";

import { useMiniGameResultSync } from "@/components/mini-games/use-mini-game-result-sync";

import { CountdownBar } from "../_components/CountdownBar";
import { DecisionControls } from "../_components/DecisionControls";
import { VcGameShell } from "../_components/VcGameShell";
import { VcPrimaryButton } from "../_components/VcPrimaryButton";
import { getVcDecisionFromKey } from "../_lib/decision-controls";
import { useEntryEnterShortcut } from "../_lib/use-entry-enter-shortcut";
import { DEAL_SIGNALS } from "./_data/signals";
import {
  DEAL_SPEED_STORAGE_KEY,
  DEAL_SPEED_STORAGE_VERSION,
  INITIAL_DEAL_SPEED_STATE,
  dealSpeedRoundReducer,
  parseDealSpeedPersistence,
  type DealChoice,
} from "./_lib/deal-speed-round-state";
import {
  mergeRecentSignalIds,
  selectSessionSignals,
  SIGNALS_PER_SESSION,
} from "./_lib/select-signals";
import {
  chooseNextFallbackMessageIndex,
  getDealSpeedResultMessage,
} from "./_lib/result-message";
import styles from "./deal-speed-round.module.css";

const DECISION_FLASH_MS = 400;
const DECISION_TIME_MS = 5_000;

export function DealSpeedRound() {
  const [state, dispatch] = useReducer(dealSpeedRoundReducer, INITIAL_DEAL_SPEED_STATE);
  const [hasHydrated, setHasHydrated] = useState(false);
  const decisionLockedRef = useRef(false);
  const activeSignalIdRef = useRef<string | null>(null);
  const signalStartedAtRef = useRef(0);
  const advanceTimerRef = useRef<number | null>(null);
  const playAgainRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- one-time localStorage hydration */
    try {
      const raw = window.localStorage.getItem(DEAL_SPEED_STORAGE_KEY);
      const saved = raw ? parseDealSpeedPersistence(JSON.parse(raw)) : null;
      if (saved) dispatch({ type: "HYDRATE", payload: saved });
    } catch {
      // Ignore unavailable or malformed local storage and start with defaults.
    }
    setHasHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;

    try {
      window.localStorage.setItem(
        DEAL_SPEED_STORAGE_KEY,
        JSON.stringify({
          version: DEAL_SPEED_STORAGE_VERSION,
          bestStreak: state.bestStreak,
          recentSignalIds: state.recentSignalIds,
        }),
      );
    } catch {
      // The game remains playable when storage is disabled or full.
    }
  }, [hasHydrated, state.bestStreak, state.recentSignalIds]);

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current !== null) {
        window.clearTimeout(advanceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (state.phase === "results") {
      playAgainRef.current?.focus();
    }
  }, [state.phase]);

  // Report the finished run to /api/mini-games/progress (idempotent per run).
  const syncResult = useMiniGameResultSync();

  useEffect(() => {
    if (state.phase !== "results") return;
    syncResult({
      score: Math.round((state.decisionsMade / SIGNALS_PER_SESSION) * 100),
      outcome: state.isNewBestStreak
        ? "new-best"
        : state.timeoutCount === 0
          ? "perfect"
          : "round-complete",
      streak: state.finalStreak,
      completed: true,
    });
  }, [
    state.phase,
    state.decisionsMade,
    state.finalStreak,
    state.isNewBestStreak,
    state.timeoutCount,
    syncResult,
  ]);

  const resolveChoice = useCallback((choice: DealChoice, timedOut = false) => {
    if (decisionLockedRef.current || !activeSignalIdRef.current) return;

    decisionLockedRef.current = true;
    const elapsedMs = Math.max(0, performance.now() - signalStartedAtRef.current);
    dispatch({
      type: "RESOLVE_SIGNAL",
      signalId: activeSignalIdRef.current,
      choice,
      timedOut,
      responseTimeMs: timedOut ? DECISION_TIME_MS : Math.round(Math.min(elapsedMs, DECISION_TIME_MS)),
    });
    advanceTimerRef.current = window.setTimeout(() => {
      decisionLockedRef.current = false;
      dispatch({ type: "ADVANCE" });
    }, DECISION_FLASH_MS);
  }, []);

  useEffect(() => {
    if (state.phase !== "playing" || state.selectedChoice !== null) return;

    decisionLockedRef.current = false;
    activeSignalIdRef.current = state.signals[state.currentIndex]?.id ?? null;
    signalStartedAtRef.current = performance.now();
    const decisionTimer = window.setTimeout(() => {
      resolveChoice("pass", true);
    }, DECISION_TIME_MS);

    return () => window.clearTimeout(decisionTimer);
  }, [resolveChoice, state.currentIndex, state.phase, state.selectedChoice, state.signals]);

  useEffect(() => {
    if (state.phase !== "playing" || state.selectedChoice !== null) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;

      const choice = getVcDecisionFromKey(event.key);
      if (!choice) return;

      event.preventDefault();
      resolveChoice(choice);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [resolveChoice, state.phase, state.selectedChoice]);

  const startSession = useCallback(() => {
    if (advanceTimerRef.current !== null) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }

    decisionLockedRef.current = false;
    const signals = selectSessionSignals(DEAL_SIGNALS, state.recentSignalIds);
    const recentSignalIds = mergeRecentSignalIds(
      state.recentSignalIds,
      signals.map((signal) => signal.id),
    );
    const fallbackMessageIndex = chooseNextFallbackMessageIndex(state.fallbackMessageIndex);

    dispatch({ type: "START_SESSION", signals, recentSignalIds, fallbackMessageIndex });
  }, [state.fallbackMessageIndex, state.recentSignalIds]);

  useEntryEnterShortcut(state.phase === "ready", startSession);

  const currentSignal = state.signals[state.currentIndex];
  const resultMessage = getDealSpeedResultMessage(
    {
      decisions: state.decisions,
      finalStreak: state.finalStreak,
      bestStreak: state.bestStreak,
      timeoutCount: state.timeoutCount,
      choiceCounts: state.choiceCounts,
      isNewBestStreak: state.isNewBestStreak,
    },
    state.fallbackMessageIndex,
  );

  return (
    <VcGameShell
      gameLabel="Deal Speed Round"
      rightContent={
        <p className={styles.bestLabel}>
          Best run <strong>{state.bestStreak}/{SIGNALS_PER_SESSION}</strong>
        </p>
      }
    >

      {state.phase === "ready" ? (
        <section className={styles.introPanel} aria-labelledby="deal-speed-title">
          <div className={styles.introMotif} aria-hidden="true">
            <Image
              src="/images/vc-games/deal-speed-round.png"
              alt=""
              fill
              sizes="190px"
              priority
            />
          </div>

          <div className={styles.introContent}>
            <p className={styles.eyebrow}>Rapid-fire screening</p>
            <h1 id="deal-speed-title">Trust your first read.</h1>

            <div className={styles.introDetails}>
              <p className={styles.mechanicLine}>8 deal signals · 5 seconds each</p>
              <p className={styles.introCopy}>
                Fund it, pass, or keep it alive before the clock moves on.
              </p>
              <p className={styles.instinctLine}>
                No perfect answer — this is about instinct under pressure.
              </p>
            </div>

            <div className={styles.introActions}>
              <div className={styles.introShortcuts} aria-label="Keyboard shortcuts">
                <span><kbd>A</kbd> Maybe</span>
                <span><kbd>W</kbd> Pass</span>
                <span><kbd>D</kbd> Fund</span>
              </div>
              <p className={styles.inputHint}>Click or use keyboard</p>
              <VcPrimaryButton beam className={styles.startButton} onClick={startSession}>
                Start Round
              </VcPrimaryButton>
            </div>
          </div>
        </section>
      ) : null}

      {state.phase === "playing" && currentSignal ? (
        <section className={styles.playPanel} aria-labelledby="current-signal">
          <div className={styles.roundMeta}>
            <p>
              Signal <strong>{state.currentIndex + 1}</strong> / {SIGNALS_PER_SESSION}
            </p>
            <p>
              Decisions made <strong>{state.decisionsMade}</strong>
            </p>
          </div>

          <CountdownBar
            durationMs={DECISION_TIME_MS}
            restartKey={currentSignal.id}
            stopped={state.selectedChoice !== null}
            label="Five-second decision timer"
            emphasizeReset
          />

          <div
            key={currentSignal.id}
            className={`${styles.signalArea} ${state.selectedChoice !== null ? styles.signalExiting : ""}`}
          >
            <p className={styles.signalPrompt}>Deal signal</p>
            <h1 id="current-signal">{currentSignal.text}</h1>
          </div>

          <DecisionControls
            selectedChoice={state.selectedChoice}
            onChoose={resolveChoice}
            variant="rapid"
          />

          <p className={styles.keyHelper}>Keys: ← / ↑ / → &nbsp;or&nbsp; A / W / D</p>

          <p className={styles.feedback} aria-live="polite">
            {state.selectedChoice
              ? state.resolvedByTimeout
                ? "Time expired — resolved as Pass"
                : `${state.selectedChoice.charAt(0).toUpperCase()}${state.selectedChoice.slice(1)} selected`
              : "\u00A0"}
          </p>
        </section>
      ) : null}

      {state.phase === "results" ? (
        <section className={styles.resultsPanel} aria-labelledby="results-title">
          <p className={styles.eyebrow}>Round complete</p>
          <h1 id="results-title">{resultMessage.message}</h1>
          <div className={styles.resultGrid}>
            <div>
              <strong>{state.decisionsMade}</strong>
              <span>Decisions made</span>
            </div>
            <div>
              <strong>{state.finalStreak}</strong>
              <span>Current streak</span>
            </div>
            <div>
              <strong>{state.bestStreak}</strong>
              <span>Best streak</span>
            </div>
          </div>
          <p className={styles.resultNote}>
            Timeouts count as an automatic Pass and reset your streak.
          </p>
          <VcPrimaryButton
            beam
            ref={playAgainRef}
            spacing="roomy"
            className={styles.playAgainButton}
            onClick={startSession}
          >
            Play Again
          </VcPrimaryButton>
        </section>
      ) : null}
    </VcGameShell>
  );
}
