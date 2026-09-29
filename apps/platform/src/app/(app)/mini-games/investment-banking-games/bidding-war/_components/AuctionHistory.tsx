import type { AuctionRoundHistory } from "../_lib/bidding-war-types";
import { formatBid } from "../_lib/format-bid";
import styles from "../bidding-war.module.css";

export function AuctionHistory({
  history,
  startingBid,
  complete = false,
}: {
  history: readonly AuctionRoundHistory[];
  startingBid: number;
  complete?: boolean;
}) {
  if (history.length === 0) return null;
  return (
    <section className={complete ? styles.fullHistory : styles.compactHistory} aria-labelledby={complete ? "auction-history-heading" : undefined}>
      <div className={styles.historyHeading}>
        <p className={styles.eyebrow}>Auction record</p>
        <h2 id={complete ? "auction-history-heading" : undefined}>
          {complete ? "Complete bid progression" : "Bid progression"}
        </h2>
      </div>
      <div className={styles.historyStart}>
        <span>Opening leading bid</span><strong>{formatBid(startingBid)}</strong>
      </div>
      <div className={styles.historyGrid}>
        {history.map((round, index) => (
          <article key={`${round.roundNumber}-${index}`} className={styles.historyCard}>
            <header><strong>Round {round.roundNumber}</strong><span>{round.learnerAction === "walk-away" ? "Exited" : round.competitorDropped ? "Competitor dropped" : "Countered"}</span></header>
            <dl>
              <div><dt>Leading bid</dt><dd>{formatBid(round.leadingBidBeforeAction)}</dd></div>
              {round.learnerBid !== undefined ? <div><dt>Your bid</dt><dd>{formatBid(round.learnerBid)}</dd></div> : null}
              {round.competitorBid !== undefined ? <div><dt>Competitor</dt><dd>{formatBid(round.competitorBid)}</dd></div> : null}
              {round.learnerAction === "walk-away" ? <div><dt>Your action</dt><dd>Walked away</dd></div> : null}
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
