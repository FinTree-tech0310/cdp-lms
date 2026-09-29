import { VcPrimaryButton } from "@/app/(app)/mini-games/vc-games/_components/VcPrimaryButton";

import type { PanicCallScenario } from "../_data/panic-call-scenarios";
import type { PanicCallPath } from "../_lib/panic-call-state";
import {
  getPanicCallOutcome,
  PANIC_CALL_PATH_LABELS,
  PANIC_CALL_PATHS,
} from "./panic-call-paths";
import styles from "../panic-call.module.css";

interface PanicCallComparisonProps {
  scenario: PanicCallScenario;
  selectedPath: PanicCallPath;
  onPlayAgain: () => void;
}

export function PanicCallComparison({
  scenario,
  selectedPath,
  onPlayAgain,
}: PanicCallComparisonProps) {
  return (
    <section className={styles.comparisonPanel} aria-labelledby="path-comparison-title">
      <p className={styles.sectionEyebrow}>Same call, different choices</p>
      <h1 id="path-comparison-title">See the other paths.</h1>
      <p className={styles.comparisonIntro}>
        Each response changes the client conversation and what follows. There is no answer key.
      </p>
      <div className={styles.pathGrid}>
        {PANIC_CALL_PATHS.map((path) => {
          const isChosen = path === selectedPath;
          return (
            <article
              key={path}
              className={styles.pathCard}
              data-chosen={isChosen}
            >
              <span>{isChosen ? "Your path" : "Alternate path"}</span>
              <h2>{PANIC_CALL_PATH_LABELS[path]}</h2>
              <p>{getPanicCallOutcome(scenario, path)}</p>
            </article>
          );
        })}
      </div>
      <div className={styles.comparisonAction}>
        <VcPrimaryButton beam spacing="roomy" onClick={onPlayAgain}>
          Play Again
        </VcPrimaryButton>
      </div>
    </section>
  );
}
