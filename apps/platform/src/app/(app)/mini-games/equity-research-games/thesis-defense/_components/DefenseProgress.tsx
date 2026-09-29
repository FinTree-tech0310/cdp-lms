import type { DefenseQuestionNumber } from "../_lib/thesis-defense-types";
import styles from "../thesis-defense.module.css";

interface DefenseProgressProps {
  currentQuestionNumber: DefenseQuestionNumber;
}

const STEPS = [1, 2, 3, 4] as const;

export function DefenseProgress({
  currentQuestionNumber,
}: DefenseProgressProps) {
  return (
    <div className={styles.progressBlock}>
      <p className={styles.questionCount}>
        Question {currentQuestionNumber} of 4
      </p>
      <ol className={styles.progressSteps} aria-label="Meeting progress">
        {STEPS.map((step) => (
          <li
            key={step}
            data-state={
              step < currentQuestionNumber
                ? "complete"
                : step === currentQuestionNumber
                  ? "current"
                  : "upcoming"
            }
            aria-current={step === currentQuestionNumber ? "step" : undefined}
          >
            <span className={styles.srOnly}>Question {step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
