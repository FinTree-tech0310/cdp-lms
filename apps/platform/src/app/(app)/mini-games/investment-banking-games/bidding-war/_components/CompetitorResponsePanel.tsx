import { ArrowRight, TrendingUp } from "lucide-react";

import { formatBid } from "../_lib/format-bid";
import styles from "../bidding-war.module.css";

export function CompetitorResponsePanel({
  competitorBid,
  nextRoundNumber,
  onContinue,
}: {
  competitorBid: number;
  nextRoundNumber: number;
  onContinue: () => void;
}) {
  return (
    <section className={styles.responsePanel} aria-labelledby="counter-heading">
      <div className={styles.responseIcon}><TrendingUp aria-hidden="true" /></div>
      <div>
        <p className={styles.eyebrow}>Competitor counters</p>
        <h2 id="counter-heading" tabIndex={-1}>{formatBid(competitorBid)}</h2>
        <p>The competitor remains active and has taken the lead.</p>
      </div>
      <button type="button" className={styles.primaryButton} onClick={onContinue}>
        <span>Continue to Round {nextRoundNumber}</span><ArrowRight aria-hidden="true" />
      </button>
    </section>
  );
}
