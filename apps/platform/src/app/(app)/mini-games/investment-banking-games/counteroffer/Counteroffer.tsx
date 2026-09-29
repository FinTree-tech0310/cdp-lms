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

import { BuyerResponsePanel } from "./_components/BuyerResponsePanel";
import { CounterofferEnding } from "./_components/CounterofferEnding";
import { CounterofferIntro } from "./_components/CounterofferIntro";
import { DealContextPanel } from "./_components/DealContextPanel";
import { NegotiationWorkspace } from "./_components/NegotiationWorkspace";
import { RoundHistory } from "./_components/RoundHistory";
import { counterofferScenarios } from "./_data/counteroffer-scenarios";
import { createRoundSnapshot, deriveFinalEnding } from "./_lib/counteroffer-scoring";
import {
  COUNTEROFFER_STORAGE_KEY,
  COUNTEROFFER_STORAGE_VERSION,
  INITIAL_COUNTEROFFER_STATE,
  counterofferReducer,
  parseCounterofferPersistence,
} from "./_lib/counteroffer-state";
import {
  markCounterofferScenarioSeen,
  selectCounterofferScenario,
} from "./_lib/select-counteroffer-scenario";
import type { LeverId } from "./_lib/counteroffer-types";
import { validateCounterofferScenarios } from "./_lib/validate-counteroffer-scenarios";
import styles from "./counteroffer.module.css";

export function Counteroffer() {
  const [state, dispatch] = useReducer(
    counterofferReducer,
    INITIAL_COUNTEROFFER_STATE,
  );
  const [hasHydrated, setHasHydrated] = useState(false);
  const responseRegionRef = useRef<HTMLDivElement>(null);
  const endingRegionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- one-time localStorage hydration */
    try {
      const raw = window.localStorage.getItem(COUNTEROFFER_STORAGE_KEY);
      const saved = raw ? parseCounterofferPersistence(JSON.parse(raw)) : null;
      if (saved) dispatch({ type: "HYDRATE", payload: saved });
    } catch {
      // Persistence is optional; rotation falls back to the in-memory session.
    }
    setHasHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    try {
      window.localStorage.setItem(
        COUNTEROFFER_STORAGE_KEY,
        JSON.stringify({
          version: COUNTEROFFER_STORAGE_VERSION,
          seenScenarioIds: state.seenScenarioIds,
        }),
      );
    } catch {
      // Persistence is optional; the game remains fully playable.
    }
  }, [hasHydrated, state.seenScenarioIds]);

  useEffect(() => {
    if (state.phase === "buyer-response") {
      responseRegionRef.current
        ?.querySelector<HTMLElement>("h2")
        ?.focus({ preventScroll: true });
    }
    if (state.phase === "ending") {
      endingRegionRef.current
        ?.querySelector<HTMLElement>("h1")
        ?.focus({ preventScroll: true });
    }
  }, [state.phase, state.roundHistory.length]);

  // Report the finished run to /api/mini-games/progress (idempotent per run).
  const syncResult = useMiniGameResultSync();

  useEffect(() => {
    if (state.phase !== "ending" || !state.finalEndingType) return;
    const finalRound = state.roundHistory.at(-1);
    const score = finalRound && finalRound.buyerAvgScore !== null
      ? Math.round(finalRound.buyerAvgScore)
      : null;
    syncResult({ score, outcome: state.finalEndingType, completed: true });
  }, [state.phase, state.finalEndingType, state.roundHistory, syncResult]);

  const startScenario = useCallback(() => {
    validateCounterofferScenarios(counterofferScenarios);
    const scenario = selectCounterofferScenario(
      counterofferScenarios,
      state.seenScenarioIds,
    );
    dispatch({ type: "START", scenario });
  }, [state.seenScenarioIds]);

  useEntryEnterShortcut(
    hasHydrated && state.phase === "ready",
    startScenario,
  );

  const scenario = state.activeScenario;
  const currentRound = scenario?.rounds.find(
    (round) => round.roundNumber === state.currentRoundNumber,
  );
  const latestSnapshot = state.roundHistory.at(-1);
  const displayedValues = state.phase === "buyer-response"
    ? latestSnapshot?.submittedValues
    : state.editableValues;

  const submitRound = useCallback(() => {
    if (!scenario || !state.editableValues || state.phase !== "negotiating") return;
    dispatch({
      type: "SUBMIT_ROUND",
      snapshot: createRoundSnapshot(
        scenario,
        state.currentRoundNumber,
        state.editableValues,
      ),
    });
  }, [scenario, state.currentRoundNumber, state.editableValues, state.phase]);

  const continueNegotiation = useCallback(() => {
    if (!scenario || !latestSnapshot || state.phase !== "buyer-response") return;
    if (state.currentRoundNumber < 3) {
      dispatch({ type: "CONTINUE_TO_NEXT_ROUND" });
      return;
    }

    const endingType = deriveFinalEnding(
      latestSnapshot.buyerTier,
      scenario.sellerStrongTermsRules,
      { ...latestSnapshot.submittedValues },
    );
    const seenScenarioIds = markCounterofferScenarioSeen(
      counterofferScenarios,
      state.seenScenarioIds,
      scenario.id,
    );
    dispatch({ type: "SHOW_ENDING", endingType, seenScenarioIds });
  }, [latestSnapshot, scenario, state.currentRoundNumber, state.phase, state.seenScenarioIds]);

  const shellStatus = state.phase === "negotiating" || state.phase === "buyer-response"
    ? `Round ${state.currentRoundNumber} of 3`
    : state.phase === "ending"
      ? "Final outcome"
      : null;

  return (
    <MiniGameShell
      gameLabel="Counteroffer"
      hubHref="/mini-games/investment-banking-games"
      backLabel="Investment Banking Games"
      rightContent={shellStatus ? <p className={styles.shellStatus}>{shellStatus}</p> : null}
    >
      {state.phase === "ready" ? (
        <CounterofferIntro isReady={hasHydrated} onStart={startScenario} />
      ) : null}

      {scenario && state.phase !== "ready" && state.phase !== "ending" && displayedValues ? (
        <div className={styles.dealDesk}>
          <header className={styles.roundHeader}>
            <div>
              <p className={styles.eyebrow}>Sell-side deal desk</p>
              <h1>Counteroffer</h1>
            </div>
            <div className={styles.roundProgress} aria-label={`Round ${state.currentRoundNumber} of 3`}>
              {[1, 2, 3].map((round) => (
                <span
                  key={round}
                  className={round <= state.currentRoundNumber ? styles.roundActive : undefined}
                  aria-hidden="true"
                >
                  {round}
                </span>
              ))}
              <strong>Round {state.currentRoundNumber} of 3</strong>
            </div>
          </header>

          <div className={styles.deskGrid}>
            <DealContextPanel
              dealContext={scenario.dealContext}
              sellerStrongTermsNote={scenario.sellerStrongTermsNote}
              buyerContextNote={state.phase === "negotiating" ? currentRound?.buyerContextNote : undefined}
            />
            <div className={styles.mainColumn}>
              {state.phase === "buyer-response" && latestSnapshot ? (
                <div ref={responseRegionRef} className={styles.responseRegion}>
                  <BuyerResponsePanel
                    roundNumber={latestSnapshot.roundNumber}
                    tier={latestSnapshot.buyerTier}
                    responseText={latestSnapshot.buyerResponseText}
                    onContinue={continueNegotiation}
                  />
                </div>
              ) : null}

              <NegotiationWorkspace
                roundNumber={state.currentRoundNumber}
                levers={scenario.levers}
                values={{ ...displayedValues }}
                disabled={state.phase === "buyer-response"}
                onChange={(leverId: LeverId, value: number) =>
                  dispatch({ type: "CHANGE_LEVER", leverId, value })
                }
                onSubmit={submitRound}
              />

              {state.roundHistory.length > 0 ? (
                <RoundHistory
                  history={state.phase === "buyer-response"
                    ? state.roundHistory.slice(0, -1)
                    : state.roundHistory}
                />
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {scenario && state.phase === "ending" && state.finalEndingType ? (
        <div ref={endingRegionRef}>
          <CounterofferEnding
            scenario={scenario}
            endingType={state.finalEndingType}
            history={state.roundHistory}
            onTryAnother={startScenario}
          />
        </div>
      ) : null}
    </MiniGameShell>
  );
}
