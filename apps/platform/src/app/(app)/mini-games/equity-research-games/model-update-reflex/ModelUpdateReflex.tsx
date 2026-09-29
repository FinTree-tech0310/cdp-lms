"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { MiniGameShell } from "@/components/mini-games/MiniGameShell";
import { useMiniGameResultSync } from "@/components/mini-games/use-mini-game-result-sync";
import { useEntryEnterShortcut } from "@/app/(app)/mini-games/vc-games/_lib/use-entry-enter-shortcut";
import { AssumptionControl } from "./_components/AssumptionControl";
import { ModelContext } from "./_components/ModelContext";
import { ModelOutputComparison } from "./_components/ModelOutputComparison";
import { ModelUpdateIntro } from "./_components/ModelUpdateIntro";
import { ModelUpdateResult } from "./_components/ModelUpdateResult";
import { MODEL_UPDATE_SCENARIOS } from "./_data/model-update-scenarios";
import { orderedAssumptions } from "./_lib/assumption-values";
import { computeModelOutputs } from "./_lib/compute-model-outputs";
import { INITIAL_MODEL_UPDATE_STATE, MODEL_UPDATE_STORAGE_KEY, modelUpdateReducer, parseModelUpdatePersistence } from "./_lib/model-update-state";
import type { AssumptionId } from "./_lib/model-update-types";
import { markModelUpdateScenarioSeen, selectModelUpdateScenario } from "./_lib/select-model-update-scenario";
import styles from "./model-update-reflex.module.css";

export function ModelUpdateReflex() {
  const [state, dispatch] = useReducer(modelUpdateReducer, INITIAL_MODEL_UPDATE_STATE);
  const [hydrated, setHydrated] = useState(false);
  const workspaceRef = useRef<HTMLHeadingElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(MODEL_UPDATE_STORAGE_KEY);
      const saved = raw ? parseModelUpdatePersistence(JSON.parse(raw)) : null;
      if (saved) dispatch({ type: "HYDRATE", payload: saved });
    } catch { /* Storage is optional; the session still works in memory. */ }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time optional storage hydration
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(MODEL_UPDATE_STORAGE_KEY, JSON.stringify({ version: 1, seenScenarioIds: state.seenScenarioIds }));
    } catch { /* Storage is optional. */ }
  }, [hydrated, state.seenScenarioIds]);

  useEffect(() => {
    const heading = state.phase === "updating" ? workspaceRef.current : state.phase === "result" ? resultRef.current : null;
    heading?.focus({ preventScroll: true });
  }, [state.phase, state.sessionKey]);

  // Report the finished run to /api/mini-games/progress (idempotent per run).
  const syncResult = useMiniGameResultSync();
  useEffect(() => {
    if (state.phase !== "result" || !state.resultSnapshot) return;
    const reviews = state.resultSnapshot.assumptionReviews;
    const onTarget = reviews.filter((review) => review.status === "onTarget").length;
    const allOnTarget = reviews.length > 0 && onTarget === reviews.length;
    syncResult({ score: reviews.length > 0 ? Math.round((onTarget / reviews.length) * 100) : null, outcome: allOnTarget ? "all-assumptions-on-target" : "assumptions-needs-adjustment", completed: true });
  }, [state.phase, state.resultSnapshot, syncResult]);

  const start = useCallback(() => {
    dispatch({ type: "START", scenario: selectModelUpdateScenario(MODEL_UPDATE_SCENARIOS, state.seenScenarioIds) });
  }, [state.seenScenarioIds]);
  useEntryEnterShortcut(hydrated && state.phase === "ready", start);

  const update = useCallback((id: AssumptionId, value: number) => {
    dispatch({ type: "UPDATE_ASSUMPTION", id, value });
  }, []);
  const submit = () => {
    if (state.phase !== "updating" || !state.activeScenario) return;
    dispatch({ type: "SUBMIT", seenScenarioIds: markModelUpdateScenarioSeen(MODEL_UPDATE_SCENARIOS, state.seenScenarioIds, state.activeScenario.id) });
  };
  const scenario = state.activeScenario;
  const liveOutputs = state.phase === "updating" && scenario && state.currentValues
    ? computeModelOutputs(scenario.priorPeriodActuals, state.currentValues) : null;

  return (
    <div className={styles.game}>
      <MiniGameShell gameLabel="Model Update Reflex" hubHref="/mini-games/equity-research-games" backLabel="Equity Research Games">
        {state.phase === "ready" ? <ModelUpdateIntro ready={hydrated} onStart={start} /> : null}
        {state.phase === "updating" && scenario && state.currentValues && state.originalOutputs && liveOutputs ? (
          <section className={styles.workspace} aria-labelledby="model-workspace-title">
            <header className={styles.workspaceHeader}>
              <p className={styles.eyebrow}>Model Update Reflex</p>
              <h1 id="model-workspace-title" ref={workspaceRef} tabIndex={-1}>Follow the effect of every revision.</h1>
            </header>
            <ModelContext scenario={scenario} />
            <div className={styles.modelLayout}>
              <section className={styles.assumptions} aria-labelledby="assumptions-title">
                <h2 id="assumptions-title" className={styles.sectionTitle}>Forecast assumptions</h2>
                {orderedAssumptions(scenario.assumptions).map(({ id, label, unit, min, max, step, startingValue, revisionEvidence }) => (
                  <AssumptionControl key={id} driver={{ id, label, unit, min, max, step, startingValue, revisionEvidence }}
                    value={state.currentValues![id]} onChange={update} />
                ))}
              </section>
              <aside className={styles.modelPanel} aria-label="Live forecast model">
                <p className={styles.eyebrow}>Your assumptions → Your forecast</p>
                <ModelOutputComparison first={state.originalOutputs} second={liveOutputs}
                  firstLabel="Original Forecast" secondLabel="Current Revision" unit={scenario.financialUnit} />
                <section className={styles.modelLogic} aria-labelledby="logic-heading">
                  <h2 id="logic-heading" className={styles.eyebrow}>Model logic</h2>
                  <p>Revenue growth → Revenue</p>
                  <p>Revenue × Gross margin → Gross profit</p>
                  <p>Opex growth → Operating expenses</p>
                  <p>Gross profit − Operating expenses → EBITDA</p>
                </section>
                <button className={styles.primaryButton} type="button" onClick={submit}>Submit Model Update</button>
                <p className={styles.helper}>Unchanged assumptions can be submitted.</p>
              </aside>
            </div>
          </section>
        ) : null}
        {state.phase === "result" && state.resultSnapshot ? <ModelUpdateResult snapshot={state.resultSnapshot} headingRef={resultRef} onTryAnother={start} /> : null}
      </MiniGameShell>
    </div>
  );
}
