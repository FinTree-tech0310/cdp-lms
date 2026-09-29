"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useLayoutEffect, useRef, useState } from "react";

import { VcPrimaryButton } from "../../_components/VcPrimaryButton";
import type { PitchSet } from "../_data/pitch-sets";
import type { PitchDecision, PitchSprintComparison } from "../_lib/pitch-sprint-state";
import styles from "../the-pitch-sprint.module.css";

gsap.registerPlugin(useGSAP);

interface PitchRevealProps {
  pitchSet: PitchSet;
  decisions: readonly PitchDecision[];
  comparison: PitchSprintComparison;
  onPlayAgain: () => void;
}

function formatPitchDecision(value: PitchDecision["choice"]) {
  return value === "fund" ? "Invest" : "Decline";
}

export function PitchReveal({
  pitchSet,
  decisions,
  comparison,
  onPlayAgain,
}: PitchRevealProps) {
  const containerRef = useRef<HTMLElement>(null);
  const playAgainRef = useRef<HTMLButtonElement>(null);
  const [revealedCardIds, setRevealedCardIds] = useState<string[]>([]);
  const decisionsByCardId = new Map(decisions.map((decision) => [decision.cardId, decision]));
  const revealedCardIdSet = new Set(revealedCardIds);
  const allCardsRevealed = revealedCardIds.length === pitchSet.cards.length;

  useLayoutEffect(() => {
    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        const panel = containerRef.current;
        if (!panel) return;

        const prefersReducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        const top = window.scrollY + panel.getBoundingClientRect().top - 8;
        window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
  }, [pitchSet.id]);

  const { contextSafe } = useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const items = gsap.utils.toArray<HTMLLIElement>("[data-reveal-item]", container);
      const cards = gsap.utils.toArray<HTMLButtonElement>("[data-reveal-card]", container);
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion) {
        gsap.set(items, { autoAlpha: 1, y: 0 });
        cards[0]?.focus({ preventScroll: true });
        return;
      }

      gsap.fromTo(
        items,
        { autoAlpha: 0, y: 16 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.38,
          ease: "power2.out",
          stagger: 0.07,
          onComplete: () => cards[0]?.focus({ preventScroll: true }),
        },
      );
    },
    { scope: containerRef, dependencies: [pitchSet.id], revertOnUpdate: true },
  );

  useGSAP(
    () => {
      if (!allCardsRevealed || !containerRef.current) return;

      const summary = gsap.utils.toArray<HTMLElement>("[data-reveal-summary]", containerRef.current);
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion) {
        gsap.set(summary, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        summary,
        { autoAlpha: 0, y: 8 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.28,
          ease: "power2.out",
          stagger: 0.06,
        },
      );
    },
    { scope: containerRef, dependencies: [allCardsRevealed] },
  );

  const revealCard = contextSafe((cardId: string, cardElement: HTMLButtonElement) => {
    const cardInner = cardElement.querySelector<HTMLElement>("[data-card-inner]");
    const revealRule = cardElement.querySelector<HTMLElement>("[data-reveal-rule]");
    const revealDetails = gsap.utils.toArray<HTMLElement>("[data-reveal-detail]", cardElement);
    if (!cardInner || cardElement.dataset.revealed === "true") return;

    cardElement.dataset.revealed = "true";
    setRevealedCardIds((current) => [...current, cardId]);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      gsap.set(cardInner, { rotationY: 180 });
      gsap.set(revealRule, { scaleX: 1 });
      gsap.set(revealDetails, { autoAlpha: 1, y: 0 });
      return;
    }

    gsap.set(revealRule, { scaleX: 0, transformOrigin: "left center" });
    gsap.set(revealDetails, { autoAlpha: 0, y: 7 });

    gsap
      .timeline({
        onComplete: () => gsap.set(cardElement, { clearProps: "transform" }),
      })
      .to(cardElement, { y: -4, duration: 0.14, ease: "power2.out" })
      .to(cardInner, { rotationY: 180, duration: 0.58, ease: "power3.inOut" }, "<0.03")
      .to(revealRule, { scaleX: 1, duration: 0.24, ease: "power2.out" }, "-=0.18")
      .to(
        revealDetails,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.24,
          ease: "power2.out",
          stagger: 0.045,
        },
        "-=0.14",
      )
      .to(cardElement, { y: 0, duration: 0.18, ease: "power2.out" }, "-=0.16");
  });

  return (
    <section ref={containerRef} className={styles.revealPanel} aria-labelledby="reveal-title">
      <header className={styles.revealHeader}>
        <p className={styles.eyebrow}>Your decisions are locked</p>
        <h1 id="reveal-title">The companies were real.</h1>
        <p className={styles.revealInstruction}>
          {revealedCardIds.length === 0
            ? "Pick one to reveal."
            : allCardsRevealed
              ? "All five companies revealed."
              : "Reveal another."}
        </p>
      </header>

      <ol className={styles.revealGrid}>
        {pitchSet.cards.map((card) => {
          const decision = decisionsByCardId.get(card.id);
          const isRevealed = revealedCardIdSet.has(card.id);
          const decisionLabel = decision ? formatPitchDecision(decision.choice) : "No call";

          return (
            <li key={card.id} data-reveal-item>
              <button
                type="button"
                className={styles.revealCard}
                data-reveal-card
                data-card-id={card.id}
                data-revealed={isRevealed}
                aria-expanded={isRevealed}
                aria-disabled={isRevealed}
                aria-label={
                  isRevealed
                    ? `${card.fictionalName} was ${card.realName}. You chose ${decisionLabel}. Outcome ${card.outcomeType}.`
                    : `Reveal ${card.fictionalName}. You chose ${decisionLabel}.`
                }
                onClick={(event) => revealCard(card.id, event.currentTarget)}
              >
                <div className={styles.revealCardInner} data-card-inner>
                  <div className={styles.revealCardFront} aria-hidden={isRevealed}>
                    <span className={styles.closedLabel}>Decision locked</span>
                    <strong>{card.fictionalName}</strong>
                    <p>
                      You {decision?.choice === "fund" ? "invested" : "declined"}
                      {decision?.timedOut ? " after timeout" : ""}
                    </p>
                    <span className={styles.revealPrompt}>Select to reveal</span>
                  </div>

                  <div className={styles.revealCardBack} aria-hidden={!isRevealed}>
                    <p className={styles.nameTrail} data-reveal-detail>{card.fictionalName} was</p>
                    <strong className={styles.realName} data-reveal-detail>{card.realName}</strong>
                    <span className={styles.revealRule} data-reveal-rule aria-hidden="true" />
                    <div className={styles.callRow} data-reveal-detail>
                      <span>
                        You: <strong>{decisionLabel}</strong>
                        {decision?.timedOut ? " (timeout)" : ""}
                      </span>
                      <span>
                        Investor signal: <strong>{formatPitchDecision(card.referenceDecision)}</strong>
                      </span>
                    </div>
                    <p className={styles.outcome} data-reveal-detail>{card.outcome}</p>
                    <p
                      className={`${styles.outcomeType} ${styles[card.outcomeType]}`}
                      data-reveal-detail
                    >
                      Outcome: <strong>{card.outcomeType}</strong>
                    </p>
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ol>

      <p className={styles.revealProgress} aria-live="polite">
        {revealedCardIds.length} of {pitchSet.cards.length} revealed
      </p>

      <footer className={styles.revealFooter}>
        {allCardsRevealed ? (
          <div className={styles.comparisonGrid} data-reveal-summary>
            <div>
              <span>Your calls</span>
              <strong>
                {comparison.learnerChoices.fund} Invest · {comparison.learnerChoices.pass} Decline
              </strong>
              {comparison.timeoutCount > 0 ? (
                <small>
                  {comparison.timeoutCount} Decline call
                  {comparison.timeoutCount === 1 ? " was" : "s were"} automatic after timeout.
                </small>
              ) : null}
            </div>
            <div>
              <span>Historical investor signals</span>
              <strong>
                {comparison.historicalSignals.fund} Invest · {comparison.historicalSignals.pass}{" "}
                Decline
              </strong>
            </div>
          </div>
        ) : null}
        {allCardsRevealed ? (
          <p className={styles.resultNote} data-reveal-summary>
            A historical comparison, not a score. Real investment decisions are contextual.
          </p>
        ) : null}
        <VcPrimaryButton
          beam
          ref={playAgainRef}
          onClick={onPlayAgain}
        >
          Play Again
        </VcPrimaryButton>
      </footer>
    </section>
  );
}
