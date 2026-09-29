import { ArrowRight, Handshake, X } from "lucide-react";

import type {
  CounterofferScenario,
  FinalEndingType,
  SubmittedRoundSnapshot,
} from "../_lib/counteroffer-types";
import { RoundHistory } from "./RoundHistory";
import styles from "../counteroffer.module.css";

const ENDING_LABELS: Record<FinalEndingType, string> = {
  "closed-strong": "Deal Closed — Strong Terms",
  "closed-modest": "Deal Closed — Modest Terms",
  "fell-through": "Deal Fell Through",
};

interface CounterofferEndingProps {
  scenario: CounterofferScenario;
  endingType: FinalEndingType;
  history: readonly SubmittedRoundSnapshot[];
  onTryAnother: () => void;
}

export function CounterofferEnding({
  scenario,
  endingType,
  history,
  onTryAnother,
}: CounterofferEndingProps) {
  const endingText = endingType === "closed-strong"
    ? scenario.endingDealClosedStrong
    : endingType === "closed-modest"
      ? scenario.endingDealClosedModest
      : scenario.endingDealFellThrough;

  return (
    <div className={styles.endingPage}>
      <section className={styles.endingHero} aria-labelledby="ending-heading">
        <div className={styles.endingIcon}>
          {endingType === "fell-through" ? <X aria-hidden="true" /> : <Handshake aria-hidden="true" />}
        </div>
        <div>
          <p className={styles.eyebrow}>Final deal outcome</p>
          <h1 id="ending-heading" tabIndex={-1}>{ENDING_LABELS[endingType]}</h1>
          <p>{endingText}</p>
        </div>
      </section>
      <section className={styles.endingPriorities} aria-labelledby="ending-priorities-heading">
        <p className={styles.eyebrow}>Seller priorities</p>
        <h2 id="ending-priorities-heading">The client mandate</h2>
        <p>{scenario.sellerStrongTermsNote}</p>
      </section>
      <RoundHistory history={history} complete />
      <div className={styles.endingActions}>
        <button type="button" className={styles.primaryButton} onClick={onTryAnother}>
          <span>Try Another</span>
          <ArrowRight aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
