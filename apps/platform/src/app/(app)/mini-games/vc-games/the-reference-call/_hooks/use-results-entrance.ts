"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

export function useResultsEntrance() {
  const resultsRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!resultsRef.current) return;

      const summary = resultsRef.current.querySelector<HTMLElement>("[data-review-summary]");
      const stats = gsap.utils.toArray<HTMLElement>("[data-review-stat]", resultsRef.current);
      const reviewHeading = resultsRef.current.querySelector<HTMLElement>(
        "[data-review-heading]",
      );
      const replayLines = gsap.utils.toArray<HTMLElement>(
        "[data-review-line]",
        resultsRef.current,
      );
      const action = resultsRef.current.querySelector<HTMLElement>("[data-review-action]");
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const allParts = [summary, ...stats, reviewHeading, ...replayLines, action].filter(
        (part): part is HTMLElement => Boolean(part),
      );

      if (reducedMotion) {
        gsap.set(allParts, { autoAlpha: 1, x: 0, y: 0 });
        return;
      }

      gsap
        .timeline({ defaults: { ease: "power2.out" } })
        .fromTo(
          summary,
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.3 },
        )
        .fromTo(
          stats,
          { autoAlpha: 0, y: 5 },
          { autoAlpha: 1, y: 0, duration: 0.2, stagger: 0.035 },
          "-=0.16",
        )
        .fromTo(
          reviewHeading,
          { autoAlpha: 0, y: 8 },
          { autoAlpha: 1, y: 0, duration: 0.24 },
          "-=0.08",
        )
        .fromTo(
          replayLines,
          { autoAlpha: 0, x: -6 },
          { autoAlpha: 1, x: 0, duration: 0.2, stagger: 0.022 },
          "-=0.08",
        )
        .fromTo(
          action,
          { autoAlpha: 0, y: 5 },
          { autoAlpha: 1, y: 0, duration: 0.2 },
          "-=0.08",
        );
    },
    { scope: resultsRef },
  );

  return resultsRef;
}
