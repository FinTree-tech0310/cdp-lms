"use client";

import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";

import { useEntryEnterShortcut } from "@/app/(app)/mini-games/vc-games/_lib/use-entry-enter-shortcut";
import { MiniGameShell } from "@/components/mini-games/MiniGameShell";
import { useMiniGameResultSync } from "@/components/mini-games/use-mini-game-result-sync";

import { EarningsOutcomeOptions } from "./_components/EarningsOutcomeOptions";
import { PriceReactionChart } from "./_components/PriceReactionChart";
import { ReadTheChartIntro } from "./_components/ReadTheChartIntro";
import { ReadTheChartResult } from "./_components/ReadTheChartResult";
import { CHART_SCENARIOS } from "./_data/chart-scenarios";
import {
  INITIAL_READ_THE_CHART_STATE,
  READ_THE_CHART_STORAGE_KEY,
  READ_THE_CHART_STORAGE_VERSION,
  parseReadTheChartPersistence,
  readTheChartReducer,
} from "./_lib/read-the-chart-state";
import type { EarningsOutcome } from "./_lib/read-the-chart-types";
import { REPORTED_QUARTER_LABELS } from "./_lib/read-the-chart-types";
import {
  markChartScenarioSeen,
  selectChartScenario,
} from "./_lib/select-chart-scenario";
import styles from "./read-the-chart.module.css";

export function ReadTheChart() {
  const [state, dispatch] = useReducer(
    readTheChartReducer,
    INITIAL_READ_THE_CHART_STATE,
  );
  const [hasHydrated, setHasHydrated] = useState(false);
  const workspaceHeadingRef = useRef<HTMLHeadingElement>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- one-time localStorage hydration */
    try {
      const raw = window.localStorage.getItem(READ_THE_CHART_STORAGE_KEY);
      const saved = raw
        ? parseReadTheChartPersistence(JSON.parse(raw))
        : null;
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
        READ_THE_CHART_STORAGE_KEY,
        JSON.stringify({
          version: READ_THE_CHART_STORAGE_VERSION,
          seenScenarioIds: state.seenScenarioIds,
        }),
      );
    } catch {
      // Persistence is optional; rotation remains available in memory.
    }
  }, [hasHydrated, state.seenScenarioIds]);

  useEffect(() => {
    if (state.phase === "reading") {
      workspaceHeadingRef.current?.focus({ preventScroll: true });
    }
    if (state.phase === "result") {
      resultHeadingRef.current?.focus({ preventScroll: true });
    }
  }, [state.phase, state.sessionKey]);

  // Report the finished run to /api/mini-games/progress (idempotent per run).
  const syncResult = useMiniGameResultSync();

  useEffect(() => {
    if (state.phase !== "result" || !state.resultSnapshot) return;
    syncResult({
      score: state.resultSnapshot.matched ? 100 : 0,
      outcome: state.resultSnapshot.matched
        ? "matched-the-read"
        : "needs-another-look",
      completed: true,
    });
  }, [state.phase, state.resultSnapshot, syncResult]);

  const startSession = useCallback(() => {
    dispatch({
      type: "START",
      scenario: selectChartScenario(
        CHART_SCENARIOS,
        state.seenScenarioIds,
      ),
    });
  }, [state.seenScenarioIds]);

  useEntryEnterShortcut(
    hasHydrated && state.phase === "ready",
    startSession,
  );

  const selectOutcome = useCallback((outcome: EarningsOutcome) => {
    dispatch({ type: "SELECT_OUTCOME", outcome });
  }, []);

  const submitRead = useCallback(() => {
    const scenario = state.activeScenario;
    if (!scenario || !state.selectedOutcome || state.phase !== "reading") {
      return;
    }

    dispatch({
      type: "SUBMIT",
      seenScenarioIds: markChartScenarioSeen(
        CHART_SCENARIOS,
        state.seenScenarioIds,
        scenario.id,
      ),
    });
  }, [
    state.activeScenario,
    state.phase,
    state.seenScenarioIds,
    state.selectedOutcome,
  ]);

  const scenario = state.activeScenario;

  return (
    <MiniGameShell
      gameLabel="Read the Chart"
      hubHref="/mini-games/equity-research-games"
      backLabel="Equity Research Games"
      rightContent={
        state.phase === "reading" ? (
          <p className={styles.shellStatus}>Earnings review</p>
        ) : state.phase === "result" ? (
          <p className={styles.shellStatus}>Analyst review</p>
        ) : null
      }
    >
      {state.phase === "ready" ? (
        <ReadTheChartIntro
          isReady={hasHydrated}
          onStart={startSession}
        />
      ) : null}

      {scenario && state.phase === "reading" ? (
        <div className={styles.gameWorkspace}>
          <header className={styles.workspaceHeader}>
            <p className={styles.eyebrow}>Read the Chart</p>
            <h1 ref={workspaceHeadingRef} tabIndex={-1}>
              What changed in investors&apos; expectations?
            </h1>
            <p>
              The reported quarter is known. Use the price reaction to judge
              what the market most likely learned about the future.
            </p>
          </header>

          <div className={styles.contextGrid}>
            <article className={styles.contextCard}>
              <p className={styles.cardLabel}>Company context</p>
              <p>{scenario.companyContext}</p>
            </article>
            <article className={styles.quarterCard}>
              <div>
                <p className={styles.cardLabel}>Reported quarter</p>
                <span className={styles.quarterResult}>
                  {REPORTED_QUARTER_LABELS[scenario.reportedQuarterResult]}
                </span>
              </div>
              <p>{scenario.reportedQuarterNote}</p>
            </article>
          </div>

          <div className={styles.analysisGrid}>
            <PriceReactionChart scenario={scenario} />

            <aside className={styles.decisionPanel}>
              <EarningsOutcomeOptions
                selectedOutcome={state.selectedOutcome}
                onSelect={selectOutcome}
              />
              <p id="submit-read-help" className={styles.submitHelp}>
                {state.selectedOutcome
                  ? "Your selection is recorded. Submit when ready."
                  : "Select one interpretation to enable Submit Read."}
              </p>
              <button
                type="button"
                className={styles.submitButton}
                disabled={!state.selectedOutcome}
                aria-describedby="submit-read-help"
                onClick={submitRead}
              >
                Submit Read
              </button>
            </aside>
          </div>
        </div>
      ) : null}

      {scenario && state.phase === "result" && state.resultSnapshot ? (
        <ReadTheChartResult
          scenario={scenario}
          snapshot={state.resultSnapshot}
          headingRef={resultHeadingRef}
          onTryAnother={startSession}
        />
      ) : null}
    </MiniGameShell>
  );
}
