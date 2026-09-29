import type { Ref } from "react";

import type { DefenseAnswerRecord } from "../_lib/thesis-defense-types";
import styles from "../thesis-defense.module.css";

interface PmReactionPanelProps {
  answer: DefenseAnswerRecord;
  isLastQuestion: boolean;
  headingRef: Ref<HTMLHeadingElement>;
  onContinue: () => void;
  onSeeAssessment: () => void;
}

export function PmReactionPanel({
  answer,
  isLastQuestion,
  headingRef,
  onContinue,
  onSeeAssessment,
}: PmReactionPanelProps) {
  return (
    <section className={styles.reactionPanel} aria-labelledby="pm-reaction-title">
      <div className={styles.speakerRow}>
        <span className={styles.pmMonogram} aria-hidden="true">PM</span>
        <div>
          <p className={styles.speakerLabel}>Portfolio Manager</p>
          <h2 id="pm-reaction-title" ref={headingRef} tabIndex={-1}>
            Response to your answer
          </h2>
        </div>
      </div>
      <blockquote>{answer.pmReaction}</blockquote>
      <button
        type="button"
        className={styles.primaryButton}
        onClick={isLastQuestion ? onSeeAssessment : onContinue}
      >
        {isLastQuestion ? "See Final Assessment" : "Continue"}
      </button>
    </section>
  );
}
