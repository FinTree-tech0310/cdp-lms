"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";

import type {
  AssetClass,
  RebalanceScenario,
} from "../_data/rebalance-scenarios";
import {
  formatAllocation,
  type AllocationRecord,
} from "../_lib/allocation-math";
import styles from "../rebalance-the-drift.module.css";

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

interface GuideRect {
  left: number;
  top: number;
  width: number;
  height: number;
  viewportWidth: number;
  viewportHeight: number;
}

interface GuideStep {
  title: string;
  body: string;
  supporting: string;
  target: string;
}

interface RebalanceGuideProps {
  dashboardRef: RefObject<HTMLElement | null>;
  stepIndex: number;
  scenario: RebalanceScenario;
  allocations: AllocationRecord;
  onStepChange: (stepIndex: number) => void;
  onSkip: () => void;
  onComplete: () => void;
  onDismiss: () => void;
}

function largestDriftAsset(
  scenario: RebalanceScenario,
  allocations: AllocationRecord,
): AssetClass {
  return scenario.allocations.reduce((largest, allocation) => {
    const drift = Math.abs(
      allocations[allocation.assetClass] / 10 - allocation.targetPercent,
    );
    const largestAllocation = scenario.allocations.find(
      (item) => item.assetClass === largest,
    );
    const largestDrift = largestAllocation
      ? Math.abs(
          allocations[largest] / 10 - largestAllocation.targetPercent,
        )
      : -1;
    return drift > largestDrift ? allocation.assetClass : largest;
  }, scenario.allocations[0].assetClass);
}

export function RebalanceGuide({
  dashboardRef,
  stepIndex,
  scenario,
  allocations,
  onStepChange,
  onSkip,
  onComplete,
  onDismiss,
}: RebalanceGuideProps) {
  const coachmarkRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [targetRect, setTargetRect] = useState<GuideRect | null>(null);
  const largestAssetClass = useMemo(
    () => largestDriftAsset(scenario, allocations),
    [allocations, scenario],
  );
  const largestAllocation = scenario.allocations.find(
    (allocation) => allocation.assetClass === largestAssetClass,
  ) ?? scenario.allocations[0];
  const largestCurrent = allocations[largestAssetClass];
  const hasRemainingDrift =
    Math.abs(largestCurrent / 10 - largestAllocation.targetPercent) > 0.0001;

  const steps: GuideStep[] = [
    {
      title: "Where the portfolio is now",
      body: "Markets moved. Your client's portfolio moved with them.",
      supporting:
        "Some investments grew faster than others, so the mix is no longer where the plan started.",
      target: '[data-rebalance-guide="current"]',
    },
    {
      title: "Where the plan intends it to be",
      body: "This is the target.",
      supporting:
        "It reflects the mix the client's plan is built around — based on goals, time horizon, liquidity needs and risk.",
      target: '[data-rebalance-guide="target"]',
    },
    {
      title: "See the drift",
      body: hasRemainingDrift
        ? "That gap is portfolio drift."
        : "This portfolio is currently aligned with its target.",
      supporting: hasRemainingDrift
        ? "If it stays there, the client may be taking more — or less — risk than the plan intended."
        : "If the mix moves away again, the client may be taking more — or less — risk than the plan intended.",
      target: `[data-rebalance-guide-asset="${largestAssetClass}"]`,
    },
    {
      title: "Bring it back toward target",
      body: "Bring the portfolio back toward target.",
      supporting:
        "Adjust one allocation and the others move with it so the whole portfolio always stays at 100%. Get each asset close to its target, then submit.",
      target: '[data-rebalance-guide="controls"]',
    },
  ];
  const step = steps[stepIndex] ?? steps[0];

  useEffect(() => {
    const root = dashboardRef.current;
    const target = root?.querySelector<HTMLElement>(step.target);
    if (!target) {
      setTargetRect(null);
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const initialRect = target.getBoundingClientRect();
    if (initialRect.top < 16 || initialRect.bottom > window.innerHeight - 16) {
      target.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "center",
      });
    }

    let frame = 0;
    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const rect = target.getBoundingClientRect();
        setTargetRect({
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
        });
      });
    };

    update();
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(target);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [dashboardRef, step.target]);

  useEffect(() => {
    window.requestAnimationFrame(() => headingRef.current?.focus());
  }, [stepIndex]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onDismiss();
        return;
      }
      if (event.key !== "Tab" || !coachmarkRef.current) return;

      const focusable = Array.from(
        coachmarkRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;
      if (
        event.shiftKey
        && (document.activeElement === first || document.activeElement === headingRef.current)
      ) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onDismiss]);

  const spotlightStyle: CSSProperties | undefined = targetRect
    ? {
        left: targetRect.left - 8,
        top: targetRect.top - 8,
        width: targetRect.width + 16,
        height: targetRect.height + 16,
      }
    : undefined;

  let coachmarkStyle: CSSProperties = {
    left: 16,
    right: 16,
    bottom: 16,
  };
  if (targetRect && targetRect.viewportWidth > 700) {
    const coachmarkWidth = Math.min(410, targetRect.viewportWidth - 32);
    const estimatedHeight = 270;
    const gap = 18;
    const targetRight = targetRect.left + targetRect.width;
    const targetBottom = targetRect.top + targetRect.height;
    const roomRight = targetRect.viewportWidth - targetRight - gap;
    const roomLeft = targetRect.left - gap;
    const roomBelow = targetRect.viewportHeight - targetRect.top - targetRect.height;
    const clampedTop = Math.max(
      16,
      Math.min(targetRect.top, targetRect.viewportHeight - estimatedHeight - 16),
    );

    if (roomRight >= coachmarkWidth) {
      coachmarkStyle = {
        left: targetRight + gap,
        top: clampedTop,
        width: coachmarkWidth,
      };
    } else if (roomLeft >= coachmarkWidth) {
      coachmarkStyle = {
        left: targetRect.left - coachmarkWidth - gap,
        top: clampedTop,
        width: coachmarkWidth,
      };
    } else if (roomBelow >= estimatedHeight) {
      const centeredLeft = Math.max(
        16,
        Math.min(
          targetRect.left + targetRect.width / 2 - coachmarkWidth / 2,
          targetRect.viewportWidth - coachmarkWidth - 16,
        ),
      );
      coachmarkStyle = {
        left: centeredLeft,
        top: targetBottom + gap,
        width: coachmarkWidth,
      };
    } else if (targetRect.top >= estimatedHeight + gap) {
      const centeredLeft = Math.max(
        16,
        Math.min(
          targetRect.left + targetRect.width / 2 - coachmarkWidth / 2,
          targetRect.viewportWidth - coachmarkWidth - 16,
        ),
      );
      coachmarkStyle = {
        left: centeredLeft,
        bottom: targetRect.viewportHeight - targetRect.top + gap,
        width: coachmarkWidth,
      };
    }
  }

  return createPortal(
    <div className={styles.guideLayer} data-testid="rebalance-guide">
      {targetRect ? (
        <div
          className={styles.guideSpotlight}
          style={spotlightStyle}
          aria-hidden="true"
        />
      ) : (
        <div className={styles.guideDimmer} aria-hidden="true" />
      )}
      <aside
        ref={coachmarkRef}
        className={styles.guideCoachmark}
        style={coachmarkStyle}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rebalance-guide-title"
        aria-describedby="rebalance-guide-copy"
      >
        <p className={styles.guideProgress}>{stepIndex + 1} of 4</p>
        <h2 ref={headingRef} id="rebalance-guide-title" tabIndex={-1}>
          {step.title}
        </h2>
        <div id="rebalance-guide-copy" className={styles.guideCopy}>
          <strong>{step.body}</strong>
          <p>{step.supporting}</p>
          {stepIndex === 2 ? (
            <p className={styles.guideExample}>
              {largestAllocation.label}: {formatAllocation(largestCurrent)} now →{" "}
              {largestAllocation.targetPercent.toFixed(1)}% target
            </p>
          ) : null}
        </div>
        <div className={styles.guideActions}>
          <button type="button" className={styles.guideSkip} onClick={onSkip}>
            Skip guide
          </button>
          <div className={styles.guideStepActions}>
            {stepIndex > 0 ? (
              <button
                type="button"
                className={styles.guideBack}
                onClick={() => onStepChange(stepIndex - 1)}
              >
                Back
              </button>
            ) : null}
            {stepIndex < 3 ? (
              <button
                type="button"
                className={styles.guideNext}
                onClick={() => onStepChange(stepIndex + 1)}
              >
                Next
              </button>
            ) : (
              <button type="button" className={styles.guideNext} onClick={onComplete}>
                Got it — start rebalancing
              </button>
            )}
          </div>
        </div>
      </aside>
    </div>,
    document.body,
  );
}
