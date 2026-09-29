"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";

import { useEntryEnterShortcut } from "@/app/(app)/mini-games/vc-games/_lib/use-entry-enter-shortcut";
import { useMiniGameResultSync } from "@/components/mini-games/use-mini-game-result-sync";

import { FraudTriageFrame } from "./_components/FraudTriageFrame";
import { FraudTriageIntro } from "./_components/FraudTriageIntro";
import { FraudTriageResults } from "./_components/FraudTriageResults";
import { TransactionQueue } from "./_components/TransactionQueue";
import { fraudTriageScenarioSets } from "./_data/fraud-triage-scenarios";
import { FRAUD_TRIAGE_STORAGE_KEY, parseFraudTriagePersistence } from "./_lib/fraud-triage-persistence";
import { countUnassigned } from "./_lib/fraud-triage-snapshot";
import { fraudTriageReducer, INITIAL_FRAUD_TRIAGE_STATE } from "./_lib/fraud-triage-state";
import { selectTriageScenario, validSeenScenarioIds } from "./_lib/select-triage-scenario";
import type { TriageAction } from "./_lib/fraud-triage-types";
import { validateTriageScenarios } from "./_lib/validate-triage-scenarios";

validateTriageScenarios(fraudTriageScenarioSets);

export function FraudSignalTriage() {
  const [state, dispatch] = useReducer(fraudTriageReducer, INITIAL_FRAUD_TRIAGE_STATE);
  const [hydrated, setHydrated] = useState(false);
  const startRef = useRef<HTMLButtonElement>(null);
  const queueHeadingRef = useRef<HTMLHeadingElement>(null);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(FRAUD_TRIAGE_STORAGE_KEY);
      const saved = raw ? parseFraudTriagePersistence(JSON.parse(raw)) : null;
      if (saved) {
        dispatch({
          type: "HYDRATE",
          seenScenarioIds: validSeenScenarioIds(fraudTriageScenarioSets, saved.seenScenarioIds),
        });
      }
    } catch {
      // Seen history is optional; the review remains available without storage.
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time browser history hydration
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(FRAUD_TRIAGE_STORAGE_KEY, JSON.stringify({
        version: 1,
        seenScenarioIds: state.seenScenarioIds,
      }));
    } catch {
      // Continue with in-memory seen history when storage is unavailable.
    }
  }, [hydrated, state.seenScenarioIds]);

  useEffect(() => {
    if (state.phase === "reviewing") queueHeadingRef.current?.focus();
    if (state.phase === "results") resultsHeadingRef.current?.focus();
  }, [state.phase, state.sessionKey]);

  // Report the finished run to /api/mini-games/progress (idempotent per run).
  const syncResult = useMiniGameResultSync();

  useEffect(() => {
    if (state.phase !== "results" || !state.resultSnapshot) return;
    const matched = state.resultSnapshot.transactions.filter(
      (transaction) => transaction.matched,
    ).length;
    const total = state.resultSnapshot.transactions.length;
    syncResult({
      score: total > 0 ? Math.round((matched / total) * 100) : null,
      outcome: total > 0 && matched === total ? "perfect-triage" : "partial-triage",
      completed: true,
    });
  }, [state.phase, state.resultSnapshot, syncResult]);

  const start = useCallback(() => {
    if (!hydrated) return;
    dispatch({
      type: "START",
      scenario: selectTriageScenario(fraudTriageScenarioSets, state.seenScenarioIds),
    });
  }, [hydrated, state.seenScenarioIds]);

  useEntryEnterShortcut(hydrated && state.phase === "ready", start);

  const backToIntro = () => {
    dispatch({ type: "BACK_TO_INTRO" });
    requestAnimationFrame(() => startRef.current?.focus());
  };

  const assign = (transactionId: string, decision: TriageAction) => {
    dispatch({ type: "ASSIGN", transactionId, decision });
  };

  const unassignedCount = state.activeScenario
    ? countUnassigned(state.activeScenario, state.assignments)
    : 0;

  return (
    <FraudTriageFrame onBack={state.phase === "ready" ? undefined : backToIntro}>
      {state.phase === "ready" ? (
        <FraudTriageIntro ready={hydrated} onStart={start} startRef={startRef} />
      ) : null}
      {state.phase === "reviewing" && state.activeScenario ? (
        <TransactionQueue
          scenario={state.activeScenario}
          assignments={state.assignments}
          unassignedCount={unassignedCount}
          headingRef={queueHeadingRef}
          onAssign={assign}
          onSubmit={() => dispatch({ type: "SUBMIT", scenarioCount: fraudTriageScenarioSets.length })}
        />
      ) : null}
      {state.phase === "results" && state.resultSnapshot ? (
        <FraudTriageResults snapshot={state.resultSnapshot} headingRef={resultsHeadingRef} onTryAnother={start} />
      ) : null}
    </FraudTriageFrame>
  );
}
