"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { forwardRef, useLayoutEffect, useRef } from "react";

import { VcPrimaryButton } from "../../_components/VcPrimaryButton";
import {
  INVESTOR_ARCHETYPE_DETAILS,
  INVESTOR_OFFER_DETAIL_ROWS,
  type InvestorArchetype,
  type InvestorOffer,
} from "../_data/investor-match-scenarios";
import styles from "../investor-match.module.css";

gsap.registerPlugin(useGSAP);

interface InvestorOutcomeProps {
  offers: readonly InvestorOffer[];
  selectedArchetype: InvestorArchetype;
  showOtherPaths: boolean;
  onRevealOtherPaths: () => void;
  onTryAnother: () => void;
}

export const InvestorOutcome = forwardRef<HTMLHeadingElement, InvestorOutcomeProps>(
  function InvestorOutcome(
    { offers, selectedArchetype, showOtherPaths, onRevealOtherPaths, onTryAnother },
    headingRef,
  ) {
    const outcomeStageRef = useRef<HTMLElement>(null);
    const comparisonRef = useRef<HTMLElement>(null);
    const selectedOffer = offers.find((offer) => offer.archetype === selectedArchetype);

    useLayoutEffect(() => {
      let secondFrame = 0;
      const firstFrame = window.requestAnimationFrame(() => {
        secondFrame = window.requestAnimationFrame(() => {
          const panel = outcomeStageRef.current;
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
    }, [selectedArchetype]);

    useGSAP(
      () => {
        if (!outcomeStageRef.current) return;

        const heroDetails = gsap.utils.toArray<HTMLElement>(
          "[data-outcome-detail]",
          outcomeStageRef.current,
        );
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (reducedMotion) {
          gsap.set(["[data-outcome-hero]", ...heroDetails], { autoAlpha: 1, y: 0 });
          return;
        }

        gsap
          .timeline({ defaults: { ease: "power2.out" } })
          .fromTo(
            "[data-outcome-hero]",
            { autoAlpha: 0, y: 10 },
            { autoAlpha: 1, y: 0, duration: 0.3 },
          )
          .fromTo(
            heroDetails,
            { autoAlpha: 0, y: 6 },
            { autoAlpha: 1, y: 0, duration: 0.22, stagger: 0.035 },
            "-=0.16",
          );
      },
      { scope: outcomeStageRef },
    );

    useGSAP(
      () => {
        if (!showOtherPaths || !comparisonRef.current) return;

        const heading = comparisonRef.current.querySelector<HTMLElement>(
          "[data-path-comparison-heading]",
        );
        const cards = gsap.utils.toArray<HTMLElement>(
          "[data-path-card]",
          comparisonRef.current,
        );
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        comparisonRef.current.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "start",
        });

        if (reducedMotion) {
          gsap.set([heading, ...cards], { autoAlpha: 1, y: 0, rotationY: 0 });
          return;
        }

        gsap
          .timeline({ defaults: { ease: "power2.out" } })
          .fromTo(
            heading,
            { autoAlpha: 0, y: 6 },
            { autoAlpha: 1, y: 0, duration: 0.22 },
          )
          .fromTo(
            cards,
            { autoAlpha: 0, y: 7, rotationY: -82, transformOrigin: "center center" },
            {
              autoAlpha: 1,
              y: 0,
              rotationY: 0,
              duration: 0.36,
              stagger: 0.075,
            },
            "-=0.08",
          );
      },
      {
        dependencies: [showOtherPaths],
        scope: outcomeStageRef,
        revertOnUpdate: true,
      },
    );

    if (!selectedOffer) return null;

    const selectedDetails = INVESTOR_ARCHETYPE_DETAILS[selectedArchetype];

    return (
      <section
        ref={outcomeStageRef}
        className={styles.outcomeStage}
        aria-labelledby="investor-outcome-title"
      >
        <div
          className={styles.outcomeHero}
          data-archetype={selectedArchetype}
          data-outcome-hero
        >
          <p className={styles.outcomeEyebrow} data-outcome-detail>
            6 months later
          </p>
          <h1 ref={headingRef} id="investor-outcome-title" tabIndex={-1} data-outcome-detail>
            You chose {selectedDetails.title}.
          </h1>
          <div className={styles.outcomeBreakdown} data-outcome-detail>
            <article>
              <span>The win</span>
              <p>{selectedOffer.outcome.benefit}</p>
            </article>
            <article>
              <span>The cost</span>
              <p>{selectedOffer.outcome.tradeoff}</p>
            </article>
          </div>
          <div className={styles.outcomeTradeoff} data-outcome-detail>
            <span>The terms you accepted</span>
            <dl>
              {INVESTOR_OFFER_DETAIL_ROWS.map((row) => (
                <div key={row.key}>
                  <dt>{row.label}</dt>
                  <dd>{selectedOffer.terms[row.key]}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {!showOtherPaths ? (
          <button type="button" className={styles.revealPathsButton} onClick={onRevealOtherPaths}>
            <span>See what the other paths looked like</span>
            <span className={styles.revealPathsArrow} aria-hidden="true">
              &rarr;
            </span>
          </button>
        ) : (
          <section
            ref={comparisonRef}
            className={styles.pathComparison}
            aria-labelledby="path-comparison-title"
          >
            <div className={styles.comparisonHeading} data-path-comparison-heading>
              <p className={styles.sectionEyebrow}>Same founder, different capital</p>
              <h2 id="path-comparison-title">The other paths</h2>
              <p>No answer key. Each offer changes what the company gains and gives up.</p>
            </div>
            <div className={styles.pathGrid}>
              {offers.map((offer) => {
                const details = INVESTOR_ARCHETYPE_DETAILS[offer.archetype];
                const isChosen = offer.archetype === selectedArchetype;

                return (
                  <article
                    key={offer.archetype}
                    className={styles.pathCard}
                    data-archetype={offer.archetype}
                    data-chosen={isChosen}
                    data-path-card
                  >
                    <span>{isChosen ? "Your path" : "Alternate path"}</span>
                    <h3>{details.title}</h3>
                    <div className={styles.pathOutcome}>
                      <strong>The win</strong>
                      <p>{offer.outcome.benefit}</p>
                    </div>
                    <div className={styles.pathOutcome}>
                      <strong>The cost</strong>
                      <p>{offer.outcome.tradeoff}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        <div className={styles.outcomeActions}>
          <VcPrimaryButton beam onClick={onTryAnother}>Try Another</VcPrimaryButton>
        </div>
      </section>
    );
  },
);
