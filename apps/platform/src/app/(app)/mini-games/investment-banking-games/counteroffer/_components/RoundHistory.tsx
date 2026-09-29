import type { SubmittedRoundSnapshot } from "../_lib/counteroffer-types";
import { formatLeverValueById } from "../_lib/format-counteroffer-value";
import styles from "../counteroffer.module.css";

const TIER_LABELS = {
  dealbreaker: "Outside buyer range",
  skeptical: "Skeptical",
  cautious: "Cautious",
  warming: "Warming",
} as const;

interface RoundHistoryProps {
  history: readonly SubmittedRoundSnapshot[];
  complete?: boolean;
}

export function RoundHistory({ history, complete = false }: RoundHistoryProps) {
  if (history.length === 0) return null;
  return (
    <section className={complete ? styles.fullHistory : styles.compactHistory} aria-labelledby={complete ? "history-heading" : undefined}>
      <div className={styles.historyHeading}>
        <p className={styles.eyebrow}>Negotiation record</p>
        <h2 id={complete ? "history-heading" : undefined}>{complete ? "Three-round history" : "Previous offers"}</h2>
      </div>
      <div className={styles.historyGrid}>
        {history.map((round) => (
          <article key={round.roundNumber} className={styles.historyCard}>
            <header>
              <strong>Round {round.roundNumber}</strong>
              <span>{TIER_LABELS[round.buyerTier]}</span>
            </header>
            <dl>
              <div><dt>Purchase Price</dt><dd>{formatLeverValueById("price", round.submittedValues.price)}</dd></div>
              <div><dt>Earn-out</dt><dd>{formatLeverValueById("earnoutMonths", round.submittedValues.earnoutMonths)}</dd></div>
              <div><dt>Governance</dt><dd>{formatLeverValueById("governance", round.submittedValues.governance, round.governanceLabel)}</dd></div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
