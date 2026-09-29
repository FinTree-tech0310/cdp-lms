"use client";

import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";

import { VcPrimaryButton } from "@/app/(app)/mini-games/vc-games/_components/VcPrimaryButton";
import { useEntryEnterShortcut } from "@/app/(app)/mini-games/vc-games/_lib/use-entry-enter-shortcut";
import { MiniGameShell } from "@/components/mini-games/MiniGameShell";
import { useMiniGameResultSync } from "@/components/mini-games/use-mini-game-result-sync";

import { PrivateWealthHubArt } from "../_components/PrivateWealthHubArt";
import { PortfolioDashboard } from "./_components/PortfolioDashboard";
import { RebalanceResults } from "./_components/RebalanceResults";
import {
  REBALANCE_SCENARIOS,
  type AssetClass,
} from "./_data/rebalance-scenarios";
import {
  scenarioCurrentAllocations,
} from "./_lib/allocation-math";
import {
  INITIAL_REBALANCE_STATE,
  REBALANCE_STORAGE_KEY,
  REBALANCE_STORAGE_VERSION,
  parseRebalancePersistence,
  rebalanceReducer,
} from "./_lib/rebalance-state";
import { selectRebalanceScenario } from "./_lib/select-rebalance-scenario";
import { validateRebalanceScenario } from "./_lib/validate-rebalance-scenario";
import styles from "./rebalance-the-drift.module.css";

export function RebalanceTheDrift() {
  const [state, dispatch] = useReducer(
    rebalanceReducer,
    INITIAL_REBALANCE_STATE,
  );
  const [hasHydrated, setHasHydrated] = useState(false);
  const introPanelRef = useRef<HTMLElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- one-time localStorage hydration */
    try {
      const raw = window.localStorage.getItem(REBALANCE_STORAGE_KEY);
      const saved = raw ? parseRebalancePersistence(JSON.parse(raw)) : null;
      if (saved) dispatch({ type: "HYDRATE", payload: saved });
    } catch {
      // Persistence is optional; the game remains playable without it.
    }
    setHasHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    try {
      window.localStorage.setItem(
        REBALANCE_STORAGE_KEY,
        JSON.stringify({
          version: REBALANCE_STORAGE_VERSION,
          seenScenarioIds: state.seenScenarioIds,
        }),
      );
    } catch {
      // Rotation falls back to in-memory history when storage is unavailable.
    }
  }, [hasHydrated, state.seenScenarioIds]);

  useEffect(() => {
    if (state.phase !== "ready") return;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    introPanelRef.current?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }, [state.phase]);

  useEffect(() => {
    if (state.phase === "results") {
      resultsRef.current?.focus({ preventScroll: true });
    }
  }, [state.phase]);

  // Report the finished run to /api/mini-games/progress (idempotent per run).
  const syncResult = useMiniGameResultSync();

  useEffect(() => {
    const scenario = state.activeScenario;
    const allocations = state.submittedAllocations;
    if (state.phase !== "results" || !scenario || !allocations) return;

    // Submitted allocations are stored in units — 10 units per percentage point.
    const startDrift = scenario.allocations.reduce(
      (total, allocation) =>
        total + Math.abs(allocation.currentPercent - allocation.targetPercent),
      0,
    );
    const endDrift = scenario.allocations.reduce(
      (total, allocation) =>
        total
        + Math.abs(
          allocations[allocation.assetClass] - allocation.targetPercent * 10,
        ) / 10,
      0,
    );
    const withinTolerance = scenario.allocations.filter(
      (allocation) =>
        Math.abs(
          allocations[allocation.assetClass] - allocation.targetPercent * 10,
        ) <= scenario.tolerancePercent * 10,
    ).length;
    const driftRemoved =
      startDrift > 0 ? 1 - endDrift / startDrift : endDrift === 0 ? 1 : 0;

    syncResult({
      score: Math.min(100, Math.max(0, Math.round(driftRemoved * 100))),
      outcome:
        withinTolerance === scenario.allocations.length
          ? "all-within-tolerance"
          : withinTolerance > 0
            ? "some-within-tolerance"
            : "none-within-tolerance",
      completed: true,
    });
  }, [state.phase, state.activeScenario, state.submittedAllocations, syncResult]);

  const startScenario = useCallback(() => {
    const selection = selectRebalanceScenario(
      REBALANCE_SCENARIOS,
      state.seenScenarioIds,
    );
    validateRebalanceScenario(selection.scenario);
    dispatch({
      type: "START",
      scenario: selection.scenario,
      allocations: scenarioCurrentAllocations(selection.scenario),
      seenScenarioIds: selection.seenScenarioIds,
    });
  }, [state.seenScenarioIds]);

  useEntryEnterShortcut(
    hasHydrated && state.phase === "ready",
    startScenario,
  );

  const adjustAllocation = useCallback(
    (assetClass: AssetClass, requestedUnits: number) => {
      dispatch({
        type: "ADJUST",
        assetClass,
        requestedUnits,
      });
    },
    [],
  );

  const scenario = state.activeScenario;
  const isDashboard = state.phase === "adjusting";

  return (
    <MiniGameShell
      gameLabel="Rebalance the Drift"
      hubHref="/mini-games/private-wealth-games"
      backLabel="Private Wealth Games"
      rightContent={
        isDashboard ? <p className={styles.shellStatus}>Portfolio allocation</p> : null
      }
    >
      {state.phase === "ready" ? (
        <section
          ref={introPanelRef}
          className={styles.introPanel}
          aria-labelledby="rebalance-title"
        >
          <PrivateWealthHubArt game="rebalance-the-drift" placement="entry" />
          <p className={styles.sectionEyebrow}>Private Wealth</p>
          <h1 id="rebalance-title">Bring the portfolio back into balance.</h1>
          <p className={styles.introCopy}>
            Adjust four asset classes, keep the portfolio at 100%, and compare your allocation with the client&apos;s target.
          </p>
          <div className={styles.introDetails}>
            <p>One portfolio scenario</p>
            <p>No timer — work through the trade-offs deliberately.</p>
          </div>
          <VcPrimaryButton beam disabled={!hasHydrated} onClick={startScenario}>
            {hasHydrated ? "Start" : "Preparing portfolio"}
          </VcPrimaryButton>
        </section>
      ) : null}

      {scenario && state.phase === "adjusting" && state.workingAllocations ? (
        <PortfolioDashboard
          key={`${state.sessionKey}:${scenario.id}`}
          scenario={scenario}
          allocations={state.workingAllocations}
          activeAssetClass={state.activeAssetClass}
          onChange={adjustAllocation}
          onActiveAssetChange={(assetClass) =>
            dispatch({ type: "SET_ACTIVE_ASSET", assetClass })
          }
          onSubmit={() => dispatch({ type: "SUBMIT" })}
        />
      ) : null}

      {scenario && state.phase === "results" && state.submittedAllocations ? (
        <div ref={resultsRef} tabIndex={-1}>
          <RebalanceResults
            scenario={scenario}
            allocations={state.submittedAllocations}
            onTryAnother={startScenario}
          />
        </div>
      ) : null}
    </MiniGameShell>
  );
}
