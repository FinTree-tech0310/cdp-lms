"use client";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { MiniGameShell } from "@/components/mini-games/MiniGameShell";
import { useMiniGameResultSync } from "@/components/mini-games/use-mini-game-result-sync";
import { useEntryEnterShortcut } from "@/app/(app)/mini-games/vc-games/_lib/use-entry-enter-shortcut";
import { VariantIntro } from "./_components/VariantIntro";
import { PublicationDecision } from "./_components/PublicationDecision";
import { VariantOutcome } from "./_components/VariantOutcome";
import { VARIANT_PERCEPTION_SCENARIOS } from "./_data/variant-perception-scenarios";
import { INITIAL_VARIANT_STATE, VARIANT_STORAGE_KEY, parseVariantPersistence, variantReducer } from "./_lib/variant-perception-state";
import { selectVariantScenario, markVariantScenarioSeen } from "./_lib/select-variant-scenario";
import { shuffleVariantOptions } from "./_lib/shuffle-variant-options";
import styles from "./variant-perception.module.css";
export function VariantPerception() {
  const [state, dispatch] = useReducer(variantReducer, INITIAL_VARIANT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const decisionRef = useRef<HTMLHeadingElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);
  const alternativesRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(VARIANT_STORAGE_KEY);
      const saved = raw ? parseVariantPersistence(JSON.parse(raw)) : null;
      if (saved) dispatch({ type: "HYDRATE", payload: saved });
    } catch { /* Optional persistence; retain an in-memory session. */ }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time optional storage hydration
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(VARIANT_STORAGE_KEY, JSON.stringify({ version: 1, seenScenarioIds: state.seenScenarioIds })); }
    catch { /* Storage is optional. */ }
  }, [hydrated, state.seenScenarioIds]);
  useEffect(() => {
    const target = state.phase === "choosing" ? decisionRef.current : state.phase === "result" ? (state.showOtherPaths ? alternativesRef.current : resultRef.current) : null;
    target?.focus();
  }, [state.phase, state.showOtherPaths, state.sessionKey]);
  // Report the finished run to /api/mini-games/progress (idempotent per run).
  const syncResult = useMiniGameResultSync();
  useEffect(() => {
    if (state.phase !== "result" || !state.resultSnapshot) return;
    // Kebab-case id for the chosen publication strength (e.g. publishBold -> publish-bold).
    const chosen = state.resultSnapshot.selectedOptionId.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
    syncResult({ outcome: chosen, completed: true });
  }, [state.phase, state.resultSnapshot, syncResult]);
  const start = useCallback(() => {
    dispatch({ type: "START", scenario: selectVariantScenario(VARIANT_PERCEPTION_SCENARIOS, state.seenScenarioIds), order: shuffleVariantOptions() });
  }, [state.seenScenarioIds]);
  useEntryEnterShortcut(hydrated && state.phase === "ready", start);
  const submit = () => {
    if (state.phase !== "choosing" || !state.activeScenario || !state.selectedOptionId) return;
    dispatch({ type: "SUBMIT", seenScenarioIds: markVariantScenarioSeen(VARIANT_PERCEPTION_SCENARIOS, state.seenScenarioIds, state.activeScenario.id) });
  };
  return <div className={styles.game}><MiniGameShell gameLabel="Variant Perception" hubHref="/mini-games/equity-research-games" backLabel="Equity Research Games">
    {state.phase === "ready" ? <VariantIntro ready={hydrated} onStart={start} /> : null}
    {state.phase === "choosing" && state.activeScenario ? <PublicationDecision setupContext={state.activeScenario.setupContext} order={state.optionDisplayOrder} selected={state.selectedOptionId} headingRef={decisionRef} onSelect={id => dispatch({ type: "SELECT", id })} onSubmit={submit} /> : null}
    {state.phase === "result" && state.resultSnapshot ? <VariantOutcome snapshot={state.resultSnapshot} showOtherPaths={state.showOtherPaths} headingRef={resultRef} alternativesRef={alternativesRef} onReveal={() => dispatch({ type: "REVEAL_OTHER_PATHS" })} onTryAnother={start} /> : null}
  </MiniGameShell></div>;
}
