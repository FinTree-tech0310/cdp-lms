"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";

import { useEntryEnterShortcut } from "@/app/(app)/mini-games/vc-games/_lib/use-entry-enter-shortcut";
import { MiniGameShell } from "@/components/mini-games/MiniGameShell";
import { useMiniGameResultSync } from "@/components/mini-games/use-mini-game-result-sync";

import { AuctionDecisionPanel } from "./_components/AuctionDecisionPanel";
import { AuctionHistory } from "./_components/AuctionHistory";
import { AuctionReferencePanel } from "./_components/AuctionReferencePanel";
import { BidEditor } from "./_components/BidEditor";
import { BiddingWarEnding } from "./_components/BiddingWarEnding";
import { BiddingWarIntro } from "./_components/BiddingWarIntro";
import { CompetitorDropPanel } from "./_components/CompetitorDropPanel";
import { CompetitorResponsePanel } from "./_components/CompetitorResponsePanel";
import { ForcedOutPanel } from "./_components/ForcedOutPanel";
import { WalkAwayConfirmation } from "./_components/WalkAwayConfirmation";
import { biddingWarScenarios } from "./_data/bidding-war-scenarios";
import {
  BIDDING_WAR_STORAGE_KEY,
  BIDDING_WAR_STORAGE_VERSION,
  INITIAL_BIDDING_WAR_STATE,
  biddingWarReducer,
  parseBiddingWarPersistence,
} from "./_lib/bidding-war-state";
import {
  markBiddingWarScenarioSeen,
  selectBiddingWarScenario,
} from "./_lib/select-bidding-war-scenario";
import { validateBiddingWarScenarios } from "./_lib/validate-bidding-war-scenarios";
import styles from "./bidding-war.module.css";

export function BiddingWar() {
  const [state, dispatch] = useReducer(biddingWarReducer, INITIAL_BIDDING_WAR_STATE);
  const [hasHydrated, setHasHydrated] = useState(false);
  const eventRegionRef = useRef<HTMLDivElement>(null);
  const endingRegionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- one-time localStorage hydration */
    try {
      const raw = window.localStorage.getItem(BIDDING_WAR_STORAGE_KEY);
      const saved = raw ? parseBiddingWarPersistence(JSON.parse(raw)) : null;
      if (saved) dispatch({ type: "HYDRATE", payload: saved });
    } catch {
      // Persistence is optional; the auction remains playable in memory.
    }
    setHasHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    try {
      window.localStorage.setItem(
        BIDDING_WAR_STORAGE_KEY,
        JSON.stringify({
          version: BIDDING_WAR_STORAGE_VERSION,
          seenScenarioIds: state.seenScenarioIds,
        }),
      );
    } catch {
      // Rotation falls back to in-memory state.
    }
  }, [hasHydrated, state.seenScenarioIds]);

  useEffect(() => {
    if (
      state.phase === "competitor-response"
      || state.phase === "competitor-dropped"
      || state.phase === "forced-out"
    ) {
      eventRegionRef.current?.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
    }
    if (state.phase === "resolved") {
      endingRegionRef.current?.querySelector<HTMLElement>("h1")?.focus({ preventScroll: true });
    }
  }, [state.phase]);

  // Report the finished run to /api/mini-games/progress (idempotent per run).
  const syncResult = useMiniGameResultSync();

  useEffect(() => {
    if (state.phase !== "resolved" || !state.finalOutcome || !state.activeScenario) return;
    const won = state.finalOutcome === "won-reasonable" || state.finalOutcome === "won-overpaid";
    // A win is graded on value for money: percent of the asset reference value paid (capped at 100).
    const score = won && state.winningBid !== null
      ? Math.min(100, Math.round((state.activeScenario.assetReferenceValue / state.winningBid) * 100))
      : null;
    syncResult({ score, outcome: state.finalOutcome, completed: true });
  }, [state.phase, state.finalOutcome, state.activeScenario, state.winningBid, syncResult]);

  const startScenario = useCallback(() => {
    validateBiddingWarScenarios(biddingWarScenarios);
    dispatch({
      type: "START",
      scenario: selectBiddingWarScenario(biddingWarScenarios, state.seenScenarioIds),
    });
  }, [state.seenScenarioIds]);

  useEntryEnterShortcut(hasHydrated && state.phase === "ready", startScenario);

  const completedSeenIds = useCallback(() => {
    if (!state.activeScenario) return state.seenScenarioIds;
    return markBiddingWarScenarioSeen(
      biddingWarScenarios,
      state.seenScenarioIds,
      state.activeScenario.id,
    );
  }, [state.activeScenario, state.seenScenarioIds]);

  const scenario = state.activeScenario;
  const shellStatus = scenario && state.phase !== "ready" && state.phase !== "resolved"
    ? `Round ${Math.min(state.currentRoundIndex + 1, scenario.maxRounds)} of ${scenario.maxRounds}`
    : state.phase === "resolved"
      ? "Final outcome"
      : null;

  return (
    <MiniGameShell
      gameLabel="Bidding War"
      hubHref="/mini-games/investment-banking-games"
      backLabel="Investment Banking Games"
      rightContent={shellStatus ? <p className={styles.shellStatus}>{shellStatus}</p> : null}
    >
      {state.phase === "ready" ? (
        <BiddingWarIntro isReady={hasHydrated} onStart={startScenario} />
      ) : null}

      {scenario && state.phase !== "ready" && state.phase !== "resolved" ? (
        <div className={styles.bidDesk}>
          <header className={styles.pageHeading}>
            <div><p className={styles.eyebrow}>Competitive M&amp;A auction</p><h1>Bidding War</h1></div>
            <div className={styles.roundProgress} aria-label={`Round ${state.currentRoundIndex + 1} of ${scenario.maxRounds}`}>
              {Array.from({ length: scenario.maxRounds }, (_, index) => (
                <span key={index} className={index <= state.currentRoundIndex ? styles.roundActive : undefined} aria-hidden="true">{index + 1}</span>
              ))}
              <strong>Round {state.currentRoundIndex + 1} of {scenario.maxRounds}</strong>
            </div>
          </header>

          <div className={styles.deskGrid}>
            <AuctionReferencePanel scenario={scenario} />
            <div className={styles.mainColumn}>
              {state.phase === "active" && state.actionMode === "choice" ? (
                <AuctionDecisionPanel
                  scenario={scenario}
                  currentLeadingBid={state.currentLeadingBid}
                  roundNumber={state.currentRoundIndex + 1}
                  onRaise={() => dispatch({ type: "OPEN_RAISE" })}
                  onWalk={() => dispatch({ type: "OPEN_WALK_CONFIRMATION" })}
                />
              ) : null}

              {state.phase === "active" && state.actionMode === "raise-editor" && state.currentProposedBid !== null ? (
                <BidEditor
                  scenario={scenario}
                  currentLeadingBid={state.currentLeadingBid}
                  proposedBid={state.currentProposedBid}
                  onChange={(value) => dispatch({ type: "CHANGE_PROPOSED_BID", value })}
                  onCancel={() => dispatch({ type: "CANCEL_RAISE" })}
                  onSubmit={() => dispatch({ type: "SUBMIT_RAISE" })}
                />
              ) : null}

              {state.phase === "active" && state.actionMode === "confirm-walk" ? (
                <WalkAwayConfirmation
                  onCancel={() => dispatch({ type: "CANCEL_WALK" })}
                  onConfirm={() => dispatch({ type: "CONFIRM_WALK", seenScenarioIds: completedSeenIds() })}
                />
              ) : null}

              {state.phase === "competitor-response" ? (
                <div ref={eventRegionRef}>
                  <CompetitorResponsePanel
                    competitorBid={state.currentLeadingBid}
                    nextRoundNumber={state.currentRoundIndex + 2}
                    onContinue={() => dispatch({ type: "CONTINUE_AFTER_COUNTER" })}
                  />
                </div>
              ) : null}

              {state.phase === "forced-out" && state.forcedOutReason ? (
                <div ref={eventRegionRef}>
                  <ForcedOutPanel
                    competitorBid={state.currentLeadingBid}
                    reason={state.forcedOutReason}
                    onExit={() => dispatch({ type: "EXIT_FORCED", seenScenarioIds: completedSeenIds() })}
                  />
                </div>
              ) : null}

              {state.phase === "competitor-dropped" && state.winningBid !== null ? (
                <div ref={eventRegionRef}>
                  <CompetitorDropPanel
                    winningBid={state.winningBid}
                    copy={scenario.outcomeCompetitorDropped}
                    onReview={() => dispatch({ type: "REVIEW_WIN", seenScenarioIds: completedSeenIds() })}
                  />
                </div>
              ) : null}

              <AuctionHistory history={state.auctionHistory} startingBid={scenario.startingBid} />
            </div>
          </div>
        </div>
      ) : null}

      {scenario && state.phase === "resolved" && state.finalOutcome ? (
        <div ref={endingRegionRef}>
          <BiddingWarEnding
            scenario={scenario}
            outcome={state.finalOutcome}
            winningBid={state.winningBid}
            history={state.auctionHistory}
            onTryAnother={startScenario}
          />
        </div>
      ) : null}
    </MiniGameShell>
  );
}
