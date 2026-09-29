import { ArrowRight, MessageSquareText } from "lucide-react";

import type { BuyerRoundTier } from "../_lib/counteroffer-types";
import styles from "../counteroffer.module.css";

const TIER_LABELS: Record<BuyerRoundTier, string> = {
  dealbreaker: "Terms outside the buyer's range",
  skeptical: "Buyer remains skeptical",
  cautious: "Buyer is engaging cautiously",
  warming: "Buyer is warming to the package",
};

interface BuyerResponsePanelProps {
  roundNumber: 1 | 2 | 3;
  tier: BuyerRoundTier;
  responseText: string;
  onContinue: () => void;
}

export function BuyerResponsePanel({
  roundNumber,
  tier,
  responseText,
  onContinue,
}: BuyerResponsePanelProps) {
  return (
    <section
      className={styles.responsePanel}
      data-tier={tier}
      aria-labelledby="buyer-response-heading"
    >
      <div className={styles.responseIcon}><MessageSquareText aria-hidden="true" /></div>
      <div className={styles.responseBody}>
        <p className={styles.eyebrow}>Buyer response · Round {roundNumber}</p>
        <h2 id="buyer-response-heading" tabIndex={-1}>{TIER_LABELS[tier]}</h2>
        <p className={styles.responseCopy}>{responseText}</p>
        {roundNumber < 3 ? (
          <p className={styles.responseGuidance}>
            The current package is not final. Use this response to revise the next offer.
          </p>
        ) : null}
      </div>
      <button type="button" className={styles.primaryButton} onClick={onContinue}>
        <span>{roundNumber < 3 ? `Continue to Round ${roundNumber + 1}` : "View Final Outcome"}</span>
        <ArrowRight aria-hidden="true" />
      </button>
    </section>
  );
}
