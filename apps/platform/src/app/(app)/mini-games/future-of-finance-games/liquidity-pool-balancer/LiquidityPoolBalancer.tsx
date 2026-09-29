"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useEntryEnterShortcut } from "@/app/(app)/mini-games/vc-games/_lib/use-entry-enter-shortcut";
import { useMiniGameResultSync } from "@/components/mini-games/use-mini-game-result-sync";
import { LiquidityPoolFrame } from "./_components/LiquidityPoolFrame";
import { LiquidityPoolIntro } from "./_components/LiquidityPoolIntro";
import { LiquidityPoolResults } from "./_components/LiquidityPoolResults";
import { SwapWorkspace } from "./_components/SwapWorkspace";
import { liquidityPoolScenarios } from "./_data/liquidity-pool-scenarios";
import { computeSwapOutputs } from "./_lib/compute-swap-outputs";
import { LIQUIDITY_POOL_STORAGE_KEY, parseLiquidityPoolPersistence } from "./_lib/liquidity-pool-persistence";
import { INITIAL_LIQUIDITY_POOL_STATE, liquidityPoolReducer } from "./_lib/liquidity-pool-state";
import { selectLiquidityPoolScenario, validLiquidityPoolSeenIds } from "./_lib/select-liquidity-pool-scenario";
import { validateLiquidityPoolScenarios } from "./_lib/validate-liquidity-pool-scenarios";

validateLiquidityPoolScenarios(liquidityPoolScenarios);

export function LiquidityPoolBalancer() {
  const [state, dispatch] = useReducer(liquidityPoolReducer, INITIAL_LIQUIDITY_POOL_STATE);
  const [hydrated, setHydrated] = useState(false);
  const startRef = useRef<HTMLButtonElement>(null);
  const workspaceHeadingRef = useRef<HTMLHeadingElement>(null);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LIQUIDITY_POOL_STORAGE_KEY);
      const saved = raw ? parseLiquidityPoolPersistence(JSON.parse(raw)) : null;
      if (saved) {
        dispatch({
          type: "HYDRATE",
          seenScenarioIds: validLiquidityPoolSeenIds(liquidityPoolScenarios, saved.seenScenarioIds),
        });
      }
    } catch {
      // The game remains playable with in-memory seen history.
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time browser history hydration
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(LIQUIDITY_POOL_STORAGE_KEY, JSON.stringify({
        version: 1,
        seenScenarioIds: state.seenScenarioIds,
      }));
    } catch {
      // The game remains playable without browser storage.
    }
  }, [hydrated, state.seenScenarioIds]);

  useEffect(() => {
    if (state.phase === "adjusting") workspaceHeadingRef.current?.focus({ preventScroll: true });
    if (state.phase === "results") resultsHeadingRef.current?.focus({ preventScroll: true });
  }, [state.phase, state.sessionKey]);

  // Report the finished run to /api/mini-games/progress (idempotent per run).
  const syncResult = useMiniGameResultSync();

  useEffect(() => {
    if (state.phase !== "results" || !state.resultSnapshot) return;
    const snapshot = state.resultSnapshot;
    const fits = snapshot.swapStatus === "onTarget";
    const rangeSpan = snapshot.idealSwapAmountMax - snapshot.idealSwapAmountMin;
    const distanceOutside = snapshot.submittedSwapAmount < snapshot.idealSwapAmountMin
      ? snapshot.idealSwapAmountMin - snapshot.submittedSwapAmount
      : snapshot.submittedSwapAmount - snapshot.idealSwapAmountMax;
    syncResult({
      score: fits
        ? 100
        : rangeSpan > 0
          ? Math.max(0, Math.round(100 * (1 - distanceOutside / rangeSpan)))
          : 0,
      outcome: snapshot.rangePosition === "onTarget"
        ? "fits-requirement"
        : snapshot.rangePosition === "belowTarget" ? "needs-increase" : "needs-decrease",
      completed: true,
    });
  }, [state.phase, state.resultSnapshot, syncResult]);

  const start = useCallback(() => {
    if (!hydrated) return;
    dispatch({
      type: "START",
      scenario: selectLiquidityPoolScenario(liquidityPoolScenarios, state.seenScenarioIds),
    });
  }, [hydrated, state.seenScenarioIds]);
  useEntryEnterShortcut(hydrated && state.phase === "ready", start);

  const backToIntro = () => {
    dispatch({ type: "BACK_TO_INTRO" });
    requestAnimationFrame(() => startRef.current?.focus());
  };

  const scenario = state.activeScenario;
  const swapAmount = state.currentSwapAmount;
  const liveOutputs = state.phase === "adjusting" && scenario && swapAmount !== null
    ? computeSwapOutputs(scenario.reserveIn, scenario.reserveOut, swapAmount)
    : null;

  return (
    <LiquidityPoolFrame onBack={state.phase === "ready" ? undefined : backToIntro}>
      {state.phase === "ready" ? (
        <LiquidityPoolIntro ready={hydrated} startRef={startRef} onStart={start} />
      ) : null}
      {state.phase === "adjusting" && scenario && swapAmount !== null && liveOutputs ? (
        <SwapWorkspace
          scenario={scenario}
          swapAmount={swapAmount}
          outputs={liveOutputs}
          headingRef={workspaceHeadingRef}
          onAmountChange={(amount) => dispatch({ type: "SET_SWAP_AMOUNT", amount })}
          onSubmit={() => dispatch({ type: "SUBMIT", scenarioCount: liquidityPoolScenarios.length })}
        />
      ) : null}
      {state.phase === "results" && state.resultSnapshot ? (
        <LiquidityPoolResults
          snapshot={state.resultSnapshot}
          headingRef={resultsHeadingRef}
          onTryAnother={start}
        />
      ) : null}
    </LiquidityPoolFrame>
  );
}
