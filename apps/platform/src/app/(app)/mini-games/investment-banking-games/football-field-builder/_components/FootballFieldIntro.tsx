import { ArrowRight, ChartNoAxesCombined } from "lucide-react";

import { BorderBeam } from "@/components/ui/border-beam";

import styles from "../football-field-builder.module.css";

export function FootballFieldIntro({ isReady, onStart }: { isReady: boolean; onStart: () => void }) {
  return (
    <section className={styles.intro} aria-labelledby="football-field-title">
      <div className={styles.introArt} aria-hidden="true">
        <ChartNoAxesCombined />
        <span className={styles.introRangeOne} /><span className={styles.introRangeTwo} /><span className={styles.introRangeThree} />
      </div>
      <div className={styles.introCopy}>
        <p className={styles.eyebrow}>Investment Banking · Valuation analysis</p>
        <h1 id="football-field-title">Build a valuation view, not a single answer.</h1>
        <p>Use three valuation methods to set practical low-to-high ranges on one shared football field.</p>
        <div className={styles.introBrief}>
          <strong>Your assignment</strong>
          <ul>
            <li>Read the analyst evidence for each methodology.</li>
            <li>Set a defensible valuation range for every row.</li>
            <li>Compare your field with the reference ranges after submitting.</li>
          </ul>
        </div>
        <button type="button" className={styles.primaryButton} disabled={!isReady} onClick={onStart}>
          <BorderBeam lightWidth={72} duration={4.2} borderWidth={2} />
          <span>{isReady ? "Build the Field" : "Preparing field"}</span>
          {isReady ? <ArrowRight aria-hidden="true" /> : null}
        </button>
      </div>
    </section>
  );
}
