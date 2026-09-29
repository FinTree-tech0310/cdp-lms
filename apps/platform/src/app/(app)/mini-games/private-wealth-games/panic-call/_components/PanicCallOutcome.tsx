import { VcPrimaryButton } from "@/app/(app)/mini-games/vc-games/_components/VcPrimaryButton";

import type { PanicCallScenario } from "../_data/panic-call-scenarios";
import type { PanicCallPath } from "../_lib/panic-call-state";
import { getPanicCallOutcome, PANIC_CALL_PATH_LABELS } from "./panic-call-paths";
import styles from "../panic-call.module.css";

interface PanicCallOutcomeProps {
  scenario: PanicCallScenario;
  selectedPath: PanicCallPath;
  onSeeOtherPaths: () => void;
  onPlayAgain: () => void;
}

export function PanicCallOutcome({
  scenario,
  selectedPath,
  onSeeOtherPaths,
  onPlayAgain,
}: PanicCallOutcomeProps) {
  const isDecline = selectedPath === "decline";

  return (
    <section className={styles.outcomePanel} aria-labelledby="panic-outcome-title">
      <p className={styles.sectionEyebrow}>
        {isDecline ? "You declined the call" : "You chose"}
      </p>
      <h1 id="panic-outcome-title">{PANIC_CALL_PATH_LABELS[selectedPath]}</h1>
      <article className={styles.outcomeStory}>
        <p>{isDecline ? "What happened next" : "One year later"}</p>
        <div>{getPanicCallOutcome(scenario, selectedPath)}</div>
      </article>
      <p className={styles.outcomeNote}>
        Explore the other authored paths to compare the trade-offs.
      </p>
      <div className={styles.outcomeActions}>
        <VcPrimaryButton beam spacing="roomy" onClick={onSeeOtherPaths}>
          See Other Paths
        </VcPrimaryButton>
        <VcPrimaryButton spacing="roomy" onClick={onPlayAgain}>
          Play Again
        </VcPrimaryButton>
      </div>
    </section>
  );
}
