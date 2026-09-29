"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";

import { useMiniGameResultSync } from "@/components/mini-games/use-mini-game-result-sync";

import { VcGameShell } from "../_components/VcGameShell";
import { VcPrimaryButton } from "../_components/VcPrimaryButton";
import { useEntryEnterShortcut } from "../_lib/use-entry-enter-shortcut";
import { InvestorOfferCard } from "./_components/InvestorOfferCard";
import { InvestorOutcome } from "./_components/InvestorOutcome";
import { INVESTOR_MATCH_SCENARIOS } from "./_data/investor-match-scenarios";
import {
  INITIAL_INVESTOR_MATCH_STATE,
  INVESTOR_MATCH_STORAGE_KEY,
  INVESTOR_MATCH_STORAGE_VERSION,
  investorMatchReducer,
  parseInvestorMatchPersistence,
} from "./_lib/investor-match-state";
import {
  selectInvestorMatchScenario,
  shuffleOffers,
  updateRecentInvestorMatchIds,
} from "./_lib/select-scenario";
import styles from "./investor-match.module.css";

gsap.registerPlugin(useGSAP);

export function InvestorMatch() {
  const [state, dispatch] = useReducer(investorMatchReducer, INITIAL_INVESTOR_MATCH_STATE);
  const [hasHydrated, setHasHydrated] = useState(false);
  const matchStageRef = useRef<HTMLElement>(null);
  const outcomeHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- one-time localStorage hydration */
    try {
      const raw = window.localStorage.getItem(INVESTOR_MATCH_STORAGE_KEY);
      const saved = raw ? parseInvestorMatchPersistence(JSON.parse(raw)) : null;
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
        INVESTOR_MATCH_STORAGE_KEY,
        JSON.stringify({
          version: INVESTOR_MATCH_STORAGE_VERSION,
          recentScenarioIds: state.recentScenarioIds,
          lastOfferOrders: state.lastOfferOrders,
        }),
      );
    } catch {
      // Persistence is optional; the game remains playable without it.
    }
  }, [hasHydrated, state.lastOfferOrders, state.recentScenarioIds]);

  useEffect(() => {
    if (state.phase === "outcome") outcomeHeadingRef.current?.focus({ preventScroll: true });
  }, [state.phase]);

  // Report the finished run to /api/mini-games/progress (idempotent per run).
  const syncResult = useMiniGameResultSync();

  useEffect(() => {
    if (state.phase !== "outcome" || !state.selectedArchetype) return;
    syncResult({
      outcome: `accepted-${state.selectedArchetype}-offer`,
      completed: true,
    });
  }, [state.phase, state.selectedArchetype, syncResult]);

  const startScenario = useCallback(() => {
    const scenario = selectInvestorMatchScenario(
      INVESTOR_MATCH_SCENARIOS,
      state.recentScenarioIds,
    );
    const offerOrder = shuffleOffers(scenario.offers, state.lastOfferOrders[scenario.id]);
    const recentScenarioIds = updateRecentInvestorMatchIds(
      state.recentScenarioIds,
      scenario.id,
      INVESTOR_MATCH_SCENARIOS.length,
    );

    dispatch({ type: "START", scenario, offerOrder, recentScenarioIds });
  }, [state.lastOfferOrders, state.recentScenarioIds]);

  useEntryEnterShortcut(state.phase === "ready", startScenario);

  const scenario = state.activeScenario;

  useGSAP(
    () => {
      if (state.phase !== "choosing" || !matchStageRef.current) return;

      const entryParts = gsap.utils.toArray<HTMLElement>(
        "[data-investor-entry]",
        matchStageRef.current,
      );
      const offerCards = gsap.utils.toArray<HTMLButtonElement>(
        "[data-investor-offer]",
        matchStageRef.current,
      );
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reducedMotion) {
        gsap.set([...entryParts, ...offerCards], { autoAlpha: 1, y: 0 });
        return;
      }

      gsap
        .timeline({ defaults: { ease: "power2.out" } })
        .fromTo(
          "[data-investor-entry='context']",
          { autoAlpha: 0, y: 9 },
          { autoAlpha: 1, y: 0, duration: 0.27 },
        )
        .fromTo(
          offerCards,
          { autoAlpha: 0, y: 11 },
          { autoAlpha: 1, y: 0, duration: 0.28, stagger: 0.055 },
          "-=0.13",
        )
        .fromTo(
          "[data-investor-entry='note']",
          { autoAlpha: 0, y: 5 },
          { autoAlpha: 1, y: 0, duration: 0.2 },
          "-=0.12",
        );
    },
    {
      dependencies: [scenario?.id, state.phase],
      scope: matchStageRef,
      revertOnUpdate: true,
    },
  );

  return (
    <VcGameShell
      gameLabel="Investor Match"
      rightContent={<p className={styles.modeLabel}>Founder view · no right answer</p>}
    >
      {state.phase === "ready" ? (
        <section className={styles.introPanel} aria-labelledby="investor-match-title">
          <div className={styles.introMotif} aria-hidden="true">
            <Image
              src="/images/vc-games/investor-match.png"
              alt=""
              fill
              sizes="200px"
              priority
            />
          </div>
          <div className={styles.introContent}>
          <p className={styles.eyebrow}>Choose your capital</p>
          <h1 id="investor-match-title">Not every investor changes the company the same way.</h1>
          <p className={styles.introCopy}>
            You are the founder. Compare three offers, choose the trade-off you can live with, and
            see where that decision leaves the company six months later.
          </p>
          <p className={styles.scenarioNotice}> founder scenarios · authored outcomes</p>
          <VcPrimaryButton beam spacing="roomy" onClick={startScenario}>
            Start
          </VcPrimaryButton>
          </div>
        </section>
      ) : null}

      {scenario && state.phase === "choosing" ? (
        <section
          ref={matchStageRef}
          className={styles.matchStage}
          aria-labelledby="founder-context-title"
        >
          <div className={styles.contextPanel} data-investor-entry="context">
            <p className={styles.sectionEyebrow}>Founder context</p>
            <h1 id="founder-context-title">Three offers. Three different companies.</h1>
            <p>{scenario.founderContext}</p>
          </div>

          <div className={styles.offerGrid} aria-label="Investor offers">
            {state.offerOrder.map((offer) => (
              <InvestorOfferCard
                key={offer.archetype}
                offer={offer}
                onChoose={(archetype) => dispatch({ type: "CHOOSE", archetype })}
              />
            ))}
          </div>
          <p className={styles.choiceNote} data-investor-entry="note">
            There is no correct offer. Choose the trade-off.
          </p>
        </section>
      ) : null}

      {scenario && state.phase === "outcome" && state.selectedArchetype ? (
        <InvestorOutcome
          ref={outcomeHeadingRef}
          offers={state.offerOrder}
          selectedArchetype={state.selectedArchetype}
          showOtherPaths={state.showOtherPaths}
          onRevealOtherPaths={() => dispatch({ type: "REVEAL_OTHER_PATHS" })}
          onTryAnother={startScenario}
        />
      ) : null}
    </VcGameShell>
  );
}
