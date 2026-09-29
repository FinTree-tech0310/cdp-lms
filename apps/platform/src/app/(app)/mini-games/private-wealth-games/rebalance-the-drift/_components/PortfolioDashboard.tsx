"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { VcPrimaryButton } from "@/app/(app)/mini-games/vc-games/_components/VcPrimaryButton";

import type {
  AssetClass,
  RebalanceScenario,
} from "../_data/rebalance-scenarios";
import type { AllocationRecord } from "../_lib/allocation-math";
import { AllocationControls } from "./AllocationControls";
import { AllocationDonut } from "./AllocationDonut";
import { RebalanceGuide } from "./RebalanceGuide";
import {
  hasSeenRebalanceGuide,
  markRebalanceGuideSeen,
} from "../_lib/rebalance-guide-persistence";
import styles from "../rebalance-the-drift.module.css";

interface PortfolioDashboardProps {
  scenario: RebalanceScenario;
  allocations: AllocationRecord;
  activeAssetClass: AssetClass | null;
  onChange: (assetClass: AssetClass, requestedUnits: number) => void;
  onActiveAssetChange: (assetClass: AssetClass | null) => void;
  onSubmit: () => void;
}

export function PortfolioDashboard({
  scenario,
  allocations,
  activeAssetClass,
  onChange,
  onActiveAssetChange,
  onSubmit,
}: PortfolioDashboardProps) {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [guideStep, setGuideStep] = useState(0);
  const dashboardRef = useRef<HTMLElement>(null);
  const helpButtonRef = useRef<HTMLButtonElement>(null);
  const openedFromHelpRef = useRef(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- one-time first-run guide hydration */
    if (!hasSeenRebalanceGuide()) {
      openedFromHelpRef.current = false;
      setGuideStep(0);
      setIsGuideOpen(true);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const focusAfterGuide = useCallback((preferControls: boolean) => {
    window.requestAnimationFrame(() => {
      if (preferControls) {
        const firstControl = dashboardRef.current?.querySelector<HTMLInputElement>(
          'input[type="range"]',
        );
        firstControl?.focus();
        if (firstControl) return;
      }
      helpButtonRef.current?.focus();
    });
  }, []);

  const closeGuide = useCallback((markSeen: boolean, preferControls: boolean) => {
    if (markSeen) markRebalanceGuideSeen();
    setIsGuideOpen(false);
    focusAfterGuide(preferControls);
  }, [focusAfterGuide]);

  const openGuide = useCallback(() => {
    openedFromHelpRef.current = true;
    setGuideStep(0);
    setIsGuideOpen(true);
  }, []);

  return (
    <section
      ref={dashboardRef}
      className={styles.dashboard}
      aria-labelledby="portfolio-dashboard-title"
    >
      <header className={styles.dashboardHeader}>
        <div>
          <p className={styles.sectionEyebrow}>Client portfolio</p>
          <h1 id="portfolio-dashboard-title">{scenario.clientName}</h1>
        </div>
        <div className={styles.dashboardHelp}>
          <span className={styles.dashboardStatus}>Allocation review</span>
          <button
            ref={helpButtonRef}
            type="button"
            className={styles.helpButton}
            disabled={isGuideOpen}
            onClick={openGuide}
          >
            How this works
          </button>
        </div>
      </header>

      <div className={styles.contextPanel}>
        <p className={styles.sectionEyebrow}>Why the portfolio drifted</p>
        <p>{scenario.contextNote}</p>
      </div>

      <div className={styles.dashboardGrid}>
        <section
          className={styles.chartPanel}
          aria-labelledby="live-allocation-title"
          data-rebalance-guide="current"
        >
          <div className={styles.chartHeading}>
            <div>
              <p className={styles.sectionEyebrow}>Portfolio mix</p>
              <h2 id="live-allocation-title">Live allocation</h2>
            </div>
            <span>Drag to rebalance</span>
          </div>
          <AllocationDonut
            scenario={scenario}
            allocations={allocations}
            activeAssetClass={activeAssetClass}
            onChange={onChange}
            onActiveAssetChange={onActiveAssetChange}
            interactionDisabled={isGuideOpen}
          />
        </section>

        <AllocationControls
          scenario={scenario}
          allocations={allocations}
          activeAssetClass={activeAssetClass}
          onChange={onChange}
          onActiveAssetChange={onActiveAssetChange}
          interactionDisabled={isGuideOpen}
        />
      </div>

      <footer className={styles.dashboardFooter}>
        <div className={styles.dashboardFooterCopy}>
          <p>Submit when the portfolio reflects the allocation you would recommend.</p>
          <small>Why rebalance? Drift can quietly make a portfolio riskier or safer than the client intended.</small>
        </div>
        <VcPrimaryButton beam spacing="roomy" disabled={isGuideOpen} onClick={onSubmit}>
          Submit Allocation
        </VcPrimaryButton>
      </footer>

      {isGuideOpen ? (
        <RebalanceGuide
          dashboardRef={dashboardRef}
          stepIndex={guideStep}
          scenario={scenario}
          allocations={allocations}
          onStepChange={setGuideStep}
          onSkip={() => closeGuide(true, true)}
          onComplete={() => closeGuide(true, true)}
          onDismiss={() => closeGuide(false, !openedFromHelpRef.current)}
        />
      ) : null}
    </section>
  );
}
