import type { Ref } from "react";

import type {
  DefenseResultSnapshot,
  ThesisDefenseScenario,
} from "../_lib/thesis-defense-types";
import { DEFENSE_ENDING_LABELS } from "../_lib/thesis-defense-types";
import styles from "../thesis-defense.module.css";
import { ThesisReference } from "./ThesisReference";

interface ThesisDefenseResultProps {
  scenario: ThesisDefenseScenario;
  snapshot: DefenseResultSnapshot;
  headingRef: Ref<HTMLHeadingElement>;
  onTryAnother: () => void;
}

export function ThesisDefenseResult({
  scenario,
  snapshot,
  headingRef,
  onTryAnother,
}: ThesisDefenseResultProps) {
  return (
    <section className={styles.resultWorkspace} aria-labelledby="defense-result-title">
      <header
        className={styles.assessmentHeader}
        data-ending={snapshot.endingType}
      >
        <p className={styles.resultEyebrow}>PM Assessment</p>
        <p className={styles.endingLabel}>
          {DEFENSE_ENDING_LABELS[snapshot.endingType]}
        </p>
        <h1 id="defense-result-title" ref={headingRef} tabIndex={-1}>
          {snapshot.endingText}
        </h1>
      </header>

      <ThesisReference scenario={scenario} compact />

      <div className={styles.reviewHeading}>
        <p className={styles.eyebrow}>Meeting review</p>
        <h2>Your defense</h2>
        <p>Review each commitment and the portfolio manager&apos;s response.</p>
      </div>

      <ol className={styles.transcriptList}>
        {snapshot.answerHistory.map((answer) => (
          <li key={answer.questionId} className={styles.transcriptItem}>
            <p className={styles.transcriptNumber}>
              Question {answer.questionNumber} of 4
            </p>
            <div className={styles.transcriptExchange}>
              <div>
                <p className={styles.transcriptSpeaker}>PM</p>
                <p>{answer.pmQuestionText}</p>
              </div>
              <div>
                <p className={styles.transcriptSpeaker}>You</p>
                <p>{answer.selectedOptionLabel}</p>
              </div>
              <div className={styles.transcriptReaction}>
                <p className={styles.transcriptSpeaker}>PM reaction</p>
                <p>{answer.pmReaction}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className={styles.resultAction}>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={onTryAnother}
        >
          Try Another
        </button>
      </div>
    </section>
  );
}
