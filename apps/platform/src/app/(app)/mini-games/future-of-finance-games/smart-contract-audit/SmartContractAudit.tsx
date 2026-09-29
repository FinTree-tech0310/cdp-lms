"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";

import { useEntryEnterShortcut } from "@/app/(app)/mini-games/vc-games/_lib/use-entry-enter-shortcut";
import { useMiniGameResultSync } from "@/components/mini-games/use-mini-game-result-sync";

import { CodeLineSelector } from "./_components/CodeLineSelector";
import { SmartContractFrame } from "./_components/SmartContractFrame";
import { SmartContractIntro } from "./_components/SmartContractIntro";
import { SmartContractResults } from "./_components/SmartContractResults";
import { VulnerabilityTypeOptions } from "./_components/VulnerabilityTypeOptions";
import { smartContractScenarios } from "./_data/smart-contract-scenarios";
import { SMART_CONTRACT_STORAGE_KEY, parseSmartContractPersistence } from "./_lib/smart-contract-persistence";
import { INITIAL_SMART_CONTRACT_STATE, smartContractReducer } from "./_lib/smart-contract-state";
import { selectSmartContractScenario, validSmartContractSeenIds } from "./_lib/select-smart-contract-scenario";
import { shuffleTypeOptionIds } from "./_lib/shuffle-type-options";
import { validateSmartContractScenarios } from "./_lib/validate-smart-contract-scenarios";
import styles from "./smart-contract-audit.module.css";

validateSmartContractScenarios(smartContractScenarios);

export function SmartContractAudit() {
  const [state, dispatch] = useReducer(smartContractReducer, INITIAL_SMART_CONTRACT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const startRef = useRef<HTMLButtonElement>(null);
  const lineHeadingRef = useRef<HTMLHeadingElement>(null);
  const typeHeadingRef = useRef<HTMLHeadingElement>(null);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SMART_CONTRACT_STORAGE_KEY);
      const saved = raw ? parseSmartContractPersistence(JSON.parse(raw)) : null;
      if (saved) {
        dispatch({
          type: "HYDRATE",
          seenScenarioIds: validSmartContractSeenIds(smartContractScenarios, saved.seenScenarioIds),
        });
      }
    } catch {
      // The audit remains playable with in-memory seen history.
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time browser history hydration
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(SMART_CONTRACT_STORAGE_KEY, JSON.stringify({
        version: 1,
        seenScenarioIds: state.seenScenarioIds,
      }));
    } catch {
      // The audit remains playable without browser storage.
    }
  }, [hydrated, state.seenScenarioIds]);

  useEffect(() => {
    if (state.phase === "lineSelection") lineHeadingRef.current?.focus({ preventScroll: true });
    if (state.phase === "typeSelection") typeHeadingRef.current?.focus({ preventScroll: true });
    if (state.phase === "results") resultsHeadingRef.current?.focus({ preventScroll: true });
  }, [state.phase, state.sessionKey]);

  // Report the finished run to /api/mini-games/progress (idempotent per run).
  const syncResult = useMiniGameResultSync();

  useEffect(() => {
    if (state.phase !== "results" || !state.resultSnapshot) return;
    const { lineMatched, typeMatched } = state.resultSnapshot;
    syncResult({
      score: (lineMatched ? 50 : 0) + (typeMatched ? 50 : 0),
      outcome: lineMatched && typeMatched
        ? "two-of-two"
        : lineMatched
          ? "line-only"
          : typeMatched
            ? "type-only"
            : "zero-of-two",
      completed: true,
    });
  }, [state.phase, state.resultSnapshot, syncResult]);

  const start = useCallback(() => {
    if (!hydrated) return;
    const scenario = selectSmartContractScenario(smartContractScenarios, state.seenScenarioIds);
    dispatch({
      type: "START",
      scenario,
      displayTypeOptionIds: shuffleTypeOptionIds(scenario.vulnerabilityTypeOptions.map(({ id }) => id)),
    });
  }, [hydrated, state.seenScenarioIds]);

  useEntryEnterShortcut(hydrated && state.phase === "ready", start);

  const backToIntro = () => {
    dispatch({ type: "BACK_TO_INTRO" });
    requestAnimationFrame(() => startRef.current?.focus());
  };
  const scenario = state.activeScenario;

  return (
    <SmartContractFrame onBack={state.phase === "ready" ? undefined : backToIntro}>
      {state.phase === "ready" ? (
        <SmartContractIntro ready={hydrated} startRef={startRef} onStart={start} />
      ) : null}
      {(state.phase === "lineSelection" || state.phase === "typeSelection") && scenario ? (
        <section className={styles.workspace} aria-labelledby="smart-contract-line-title">
          <header className={styles.workspaceHeader}>
            <p className={styles.eyebrow}>Technical risk · Code review</p>
            <h1 id="smart-contract-line-title" ref={lineHeadingRef} tabIndex={-1}>Read the function.</h1>
            <p>Identify the line containing the vulnerability, then classify the issue.</p>
          </header>
          <div className={styles.contextPanel}>
            <p className={styles.panelLabel}>Function context</p>
            <p>{scenario.functionContext}</p>
          </div>
          <section className={styles.auditPanel} aria-labelledby="part-one-title">
            <div className={styles.sectionHeading}>
              <p className={styles.panelLabel}>Part 1 · Line identification</p>
              <h2 id="part-one-title">Which line contains the vulnerability?</h2>
            </div>
            <CodeLineSelector
              lines={scenario.lines}
              selectedLineId={state.selectedLineId}
              confirmedLineId={state.confirmedLineId}
              onSelect={(lineId) => dispatch({ type: "SELECT_LINE", lineId })}
            />
            {state.phase === "lineSelection" ? (
              <div className={styles.panelActions}>
                <p className={styles.actionHelp}>Select one line before confirming. You can revise it until then.</p>
                <button
                  className={styles.primaryButton}
                  type="button"
                  disabled={!state.selectedLineId}
                  onClick={() => dispatch({ type: "CONFIRM_LINE" })}
                >
                  Confirm Line
                </button>
              </div>
            ) : (
              <p className={styles.confirmedNote}>Your line choice is confirmed. Classify the vulnerability below.</p>
            )}
          </section>
          {state.phase === "typeSelection" ? (
            <section className={styles.auditPanel} aria-labelledby="smart-contract-type-title">
              <div className={styles.sectionHeading}>
                <p className={styles.panelLabel}>Part 2 · Classification</p>
                <h2 id="smart-contract-type-title" ref={typeHeadingRef} tabIndex={-1}>
                  What kind of vulnerability is present?
                </h2>
              </div>
              <VulnerabilityTypeOptions
                options={scenario.vulnerabilityTypeOptions}
                displayOptionIds={state.displayTypeOptionIds}
                selectedTypeId={state.selectedTypeId}
                onSelect={(typeId) => dispatch({ type: "SELECT_TYPE", typeId })}
              />
              <div className={styles.panelActions}>
                <p className={styles.actionHelp}>Choose one classification to enable Submit Audit.</p>
                <button
                  className={styles.primaryButton}
                  type="button"
                  disabled={!state.confirmedLineId || !state.selectedTypeId}
                  onClick={() => dispatch({ type: "SUBMIT", scenarioCount: smartContractScenarios.length })}
                >
                  Submit Audit
                </button>
              </div>
            </section>
          ) : null}
        </section>
      ) : null}
      {state.phase === "results" && state.resultSnapshot ? (
        <SmartContractResults snapshot={state.resultSnapshot} headingRef={resultsHeadingRef} onTryAnother={start} />
      ) : null}
    </SmartContractFrame>
  );
}
