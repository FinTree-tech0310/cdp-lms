"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useEntryEnterShortcut } from "@/app/(app)/mini-games/vc-games/_lib/use-entry-enter-shortcut";
import { useMiniGameResultSync } from "@/components/mini-games/use-mini-game-result-sync";
import { TradingFrame } from "./_components/TradingFrame";
import { TradingIntro } from "./_components/TradingIntro";
import { TradingResults } from "./_components/TradingResults";
import { TradingWorkspace } from "./_components/TradingWorkspace";
import { tradingScenarios } from "./_data/trading-scenarios";
import { TRADING_STORAGE_KEY, parseTradingPersistence } from "./_lib/trading-persistence";
import { selectTradingScenario, validTradingSeenIds } from "./_lib/select-trading-scenario";
import { INITIAL_TRADING_STATE, tradingReducer } from "./_lib/trading-state";
import { validateTradingScenarios } from "./_lib/validate-trading-scenarios";

validateTradingScenarios(tradingScenarios);

export function BuildTheTradingAlgorithm() {
  const [state, dispatch] = useReducer(tradingReducer, INITIAL_TRADING_STATE);
  const [hydrated, setHydrated] = useState(false);
  const startRef = useRef<HTMLButtonElement>(null);
  const workspaceHeadingRef = useRef<HTMLHeadingElement>(null);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(TRADING_STORAGE_KEY);
      const saved = raw ? parseTradingPersistence(JSON.parse(raw)) : null;
      if (saved) dispatch({ type: "HYDRATE", seenScenarioIds: validTradingSeenIds(tradingScenarios, saved.seenScenarioIds) });
    } catch {
      // The strategy experiment remains playable with in-memory seen history.
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time browser history hydration
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(TRADING_STORAGE_KEY, JSON.stringify({ version: 1, seenScenarioIds: state.seenScenarioIds }));
    } catch {
      // The strategy experiment remains playable without browser storage.
    }
  }, [hydrated, state.seenScenarioIds]);

  useEffect(() => {
    if (state.phase === "choosing") workspaceHeadingRef.current?.focus({ preventScroll: true });
    if (state.phase === "results") resultsHeadingRef.current?.focus({ preventScroll: true });
  }, [state.phase, state.sessionKey]);

  // Report the finished run to /api/mini-games/progress (idempotent per run).
  const syncResult = useMiniGameResultSync();

  useEffect(() => {
    if (state.phase !== "results" || !state.resultSnapshot) return;
    const snapshot = state.resultSnapshot;
    // This game grades nothing by design, so only the run's result is reported.
    const outcome = snapshot.numberOfTrades === 0
      ? "no-trades-triggered"
      : snapshot.totalReturnPercent > 0
        ? "positive-return"
        : snapshot.totalReturnPercent < 0
          ? "negative-return"
          : "flat-return";
    syncResult({ outcome, completed: true });
  }, [state.phase, state.resultSnapshot, syncResult]);

  const start = useCallback(() => {
    if (!hydrated) return;
    dispatch({ type: "START", scenario: selectTradingScenario(tradingScenarios, state.seenScenarioIds) });
  }, [hydrated, state.seenScenarioIds]);
  useEntryEnterShortcut(hydrated && state.phase === "ready", start);

  const backToIntro = () => {
    dispatch({ type: "BACK_TO_INTRO" });
    requestAnimationFrame(() => startRef.current?.focus());
  };

  return (
    <TradingFrame onBack={state.phase === "ready" ? undefined : backToIntro}>
      {state.phase === "ready" ? <TradingIntro ready={hydrated} startRef={startRef} onStart={start} /> : null}
      {state.phase === "choosing" && state.activeScenario ? (
        <TradingWorkspace
          marketContext={state.activeScenario.marketContext}
          selectedEntryRuleId={state.selectedEntryRuleId}
          selectedExitRuleId={state.selectedExitRuleId}
          headingRef={workspaceHeadingRef}
          onEntrySelect={(ruleId) => dispatch({ type: "SELECT_ENTRY", ruleId })}
          onExitSelect={(ruleId) => dispatch({ type: "SELECT_EXIT", ruleId })}
          onRun={() => dispatch({ type: "RUN", scenarioCount: tradingScenarios.length })}
        />
      ) : null}
      {state.phase === "results" && state.resultSnapshot ? (
        <TradingResults snapshot={state.resultSnapshot} headingRef={resultsHeadingRef} onTryAnother={start} />
      ) : null}
    </TradingFrame>
  );
}
