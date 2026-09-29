import type { Ref } from "react";

import type {
  DefenseAnswerOption,
  DefenseAnswerRecord,
  DefenseQuestion,
  DefenseQuestionNumber,
} from "../_lib/thesis-defense-types";
import styles from "../thesis-defense.module.css";
import { DefenseProgress } from "./DefenseProgress";
import { PmReactionPanel } from "./PmReactionPanel";

interface DefenseQuestionStageProps {
  question: DefenseQuestion;
  questionNumber: DefenseQuestionNumber;
  orderedOptions: readonly DefenseAnswerOption[];
  selectedAnswer: DefenseAnswerRecord | null;
  phase: "question" | "reaction";
  questionHeadingRef: Ref<HTMLHeadingElement>;
  reactionHeadingRef: Ref<HTMLHeadingElement>;
  onSelect: (optionId: string) => void;
  onContinue: () => void;
  onSeeAssessment: () => void;
}

export function DefenseQuestionStage({
  question,
  questionNumber,
  orderedOptions,
  selectedAnswer,
  phase,
  questionHeadingRef,
  reactionHeadingRef,
  onSelect,
  onContinue,
  onSeeAssessment,
}: DefenseQuestionStageProps) {
  const isLocked = phase === "reaction";

  return (
    <section className={styles.questionStage}>
      <DefenseProgress currentQuestionNumber={questionNumber} />

      <article className={styles.pmQuestionPanel}>
        <div className={styles.speakerRow}>
          <span className={styles.pmMonogram} aria-hidden="true">PM</span>
          <div>
            <p className={styles.speakerLabel}>Portfolio Manager</p>
            <h1 ref={questionHeadingRef} tabIndex={-1}>
              {question.pmQuestionText}
            </h1>
          </div>
        </div>
      </article>

      <section className={styles.responsePanel} aria-labelledby="your-response-title">
        <div className={styles.responseHeading}>
          <div>
            <p className={styles.cardLabel}>Your response</p>
            <h2 id="your-response-title">
              {isLocked ? "Answer committed" : "How do you respond?"}
            </h2>
          </div>
          {isLocked ? <span className={styles.lockedLabel}>Locked</span> : null}
        </div>

        <div className={styles.answerOptions}>
          {orderedOptions.map((option) => {
            const isSelected = selectedAnswer?.selectedOptionId === option.id;
            return (
              <button
                key={option.id}
                type="button"
                className={styles.answerOption}
                data-selected={isSelected}
                disabled={isLocked}
                aria-pressed={isSelected}
                onClick={() => onSelect(option.id)}
              >
                <span className={styles.optionMarker} aria-hidden="true" />
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {isLocked && selectedAnswer ? (
        <PmReactionPanel
          answer={selectedAnswer}
          isLastQuestion={questionNumber === 4}
          headingRef={reactionHeadingRef}
          onContinue={onContinue}
          onSeeAssessment={onSeeAssessment}
        />
      ) : null}
    </section>
  );
}
