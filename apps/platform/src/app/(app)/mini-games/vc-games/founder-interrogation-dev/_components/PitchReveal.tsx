"use client";

import { forwardRef } from "react";

import { VcPrimaryButton } from "../../_components/VcPrimaryButton";
import type { FounderPitchVideo } from "../_data/founder-pitch-videos";
import type { FounderDecision } from "../_lib/founder-interrogation-state";
import styles from "../founder-interrogation.module.css";

interface PitchRevealProps {
  pitch: FounderPitchVideo;
  decision: FounderDecision;
  onBackToVideos: () => void;
}

export const PitchReveal = forwardRef<HTMLHeadingElement, PitchRevealProps>(function PitchReveal(
  { pitch, decision, onBackToVideos },
  ref,
) {
  return (
    <section className={styles.revealStage} aria-labelledby="pitch-reveal-title">
      <div className={styles.revealHero}>
        <p className={styles.decisionReceipt}>
          You {decision === "accept" ? "accepted" : "rejected"} this pitch
        </p>
        <p className={styles.revealLead}>This idea later became</p>
        <h1 id="pitch-reveal-title" ref={ref} tabIndex={-1}>{pitch.realCompanyName}</h1>
        <div className={styles.outcomePanel}>
          <span>What happened</span>
          <p>{pitch.outcome}</p>
        </div>
        <p className={styles.reflectionNote}>
          The outcome is context, not a correct-or-wrong judgment on your decision.
        </p>
      </div>
      <div className={styles.revealActions}>
        <VcPrimaryButton spacing="roomy" onClick={onBackToVideos}>Back to Videos</VcPrimaryButton>
      </div>
    </section>
  );
});
