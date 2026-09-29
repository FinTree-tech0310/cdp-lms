"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";

import { useEntryEnterShortcut } from "@/app/(app)/mini-games/vc-games/_lib/use-entry-enter-shortcut";
import { MiniGameShell } from "@/components/mini-games/MiniGameShell";
import { useMiniGameResultSync } from "@/components/mini-games/use-mini-game-result-sync";

import { FootballFieldChart } from "./_components/FootballFieldChart";
import { FootballFieldIntro } from "./_components/FootballFieldIntro";
import { FootballFieldResults } from "./_components/FootballFieldResults";
import { RangeNumericControls } from "./_components/RangeNumericControls";
import { ValuationContextPanel } from "./_components/ValuationContextPanel";
import { footballFieldScenarios } from "./_data/football-field-scenarios";
import { createFootballFieldSnapshot } from "./_lib/football-field-scoring";
import { FOOTBALL_FIELD_STORAGE_KEY, FOOTBALL_FIELD_STORAGE_VERSION, footballFieldReducer, INITIAL_FOOTBALL_FIELD_STATE, parseFootballFieldPersistence } from "./_lib/football-field-state";
import { markFootballFieldScenarioSeen, selectFootballFieldScenario } from "./_lib/select-football-field-scenario";
import type { MethodologyId } from "./_lib/football-field-types";
import { validateFootballFieldScenarios } from "./_lib/validate-football-field-scenarios";
import styles from "./football-field-builder.module.css";

export function FootballFieldBuilder() {
  const [state, dispatch] = useReducer(footballFieldReducer, INITIAL_FOOTBALL_FIELD_STATE);
  const [hasHydrated, setHasHydrated] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- one-time localStorage hydration */
    try {
      const raw = window.localStorage.getItem(FOOTBALL_FIELD_STORAGE_KEY);
      const saved = raw ? parseFootballFieldPersistence(JSON.parse(raw)) : null;
      if (saved) dispatch({ type: "HYDRATE", payload: saved });
    } catch {
      // Rotation remains playable without browser storage.
    }
    setHasHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    try {
      window.localStorage.setItem(FOOTBALL_FIELD_STORAGE_KEY, JSON.stringify({ version: FOOTBALL_FIELD_STORAGE_VERSION, seenScenarioIds: state.seenScenarioIds }));
    } catch {
      // Rotation remains available for this in-memory session.
    }
  }, [hasHydrated, state.seenScenarioIds]);

  useEffect(() => {
    if (state.phase === "results") resultsRef.current?.focus({ preventScroll: true });
  }, [state.phase]);

  // Report the finished run to /api/mini-games/progress (idempotent per run).
  const syncResult = useMiniGameResultSync();

  useEffect(() => {
    if (state.phase !== "results" || !state.submittedSnapshot) return;
    const snapshot = state.submittedSnapshot;
    const statuses = Object.values(snapshot.statuses);
    const onTarget = statuses.filter((status) => status === "on-target").length;
    syncResult({ score: statuses.length > 0 ? Math.round((onTarget / statuses.length) * 100) : null, outcome: snapshot.dealPriceCaptured ? "deal-inside-range" : "deal-outside-range", completed: true });
  }, [state.phase, state.submittedSnapshot, syncResult]);

  const startScenario = useCallback(() => {
    validateFootballFieldScenarios(footballFieldScenarios);
    dispatch({ type: "START", scenario: selectFootballFieldScenario(footballFieldScenarios, state.seenScenarioIds) });
  }, [state.seenScenarioIds]);

  useEntryEnterShortcut(hasHydrated && state.phase === "ready", startScenario);

  const updateEndpoint = useCallback((methodologyId: MethodologyId, endpoint: "low" | "high", value: number) => {
    if (!Number.isFinite(value)) return;
    dispatch({ type: "UPDATE_ENDPOINT", methodologyId, endpoint, value });
  }, []);

  const submit = useCallback(() => {
    if (!state.activeScenario || !state.ranges || state.phase !== "building") return;
    const seenScenarioIds = markFootballFieldScenarioSeen(footballFieldScenarios, state.seenScenarioIds, state.activeScenario.id);
    dispatch({ type: "SUBMIT", snapshot: createFootballFieldSnapshot(state.activeScenario, state.ranges), seenScenarioIds });
  }, [state.activeScenario, state.phase, state.ranges, state.seenScenarioIds]);

  const scenario = state.activeScenario;
  const shellStatus = state.phase === "building" ? "Build valuation field" : state.phase === "results" ? "Analyst review" : null;

  return (
    <MiniGameShell gameLabel="Football Field Builder" hubHref="/mini-games/investment-banking-games" backLabel="Investment Banking Games" rightContent={shellStatus ? <p className={styles.shellStatus}>{shellStatus}</p> : null}>
      {state.phase === "ready" ? <FootballFieldIntro isReady={hasHydrated} onStart={startScenario} /> : null}
      {scenario && state.phase === "building" && state.ranges ? <div className={styles.workspace}>
        <header className={styles.pageHeading}><p className={styles.eyebrow}>Valuation workspace</p><h1>Football Field Builder</h1><p>Set each range using the evidence, then compare all methods on one valuation axis.</p></header>
        <div className={styles.deskGrid}>
          <ValuationContextPanel scenario={scenario} />
          <main className={styles.builderColumn}>
            <FootballFieldChart scenario={scenario} ranges={state.ranges} interactive onChange={updateEndpoint} />
            <section className={styles.methodologyList} aria-label="Methodology evidence and range inputs">
              {scenario.methodologies.map((methodology) => <RangeNumericControls key={methodology.id} methodology={methodology} scenario={scenario} range={state.ranges![methodology.id]} disabled={false} onChange={updateEndpoint} />)}
            </section>
            <div className={styles.submitArea}><p>All three ranges are editable. Submit when your valuation field reflects the analyst evidence.</p><button type="button" className={styles.primaryButton} onClick={submit}><span>Submit Valuation</span></button></div>
          </main>
        </div>
      </div> : null}
      {scenario && state.phase === "results" && state.submittedSnapshot ? <div ref={resultsRef}><FootballFieldResults scenario={scenario} snapshot={state.submittedSnapshot} onTryAnother={startScenario} /></div> : null}
    </MiniGameShell>
  );
}
