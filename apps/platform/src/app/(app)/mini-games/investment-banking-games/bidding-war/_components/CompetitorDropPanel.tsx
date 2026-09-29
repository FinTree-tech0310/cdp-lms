import { ArrowRight, Flag } from "lucide-react";

import { formatBid } from "../_lib/format-bid";
import styles from "../bidding-war.module.css";

export function CompetitorDropPanel({
  winningBid,
  copy,
  onReview,
}: {
  winningBid: number;
  copy: string;
  onReview: () => void;
}) {
  return (
    <section className={styles.dropPanel} aria-labelledby="drop-heading">
      <div className={styles.responseIcon}><Flag aria-hidden="true" /></div>
      <div>
        <p className={styles.eyebrow}>Auction update</p>
        <h2 id="drop-heading" tabIndex={-1}>Competitor Drops Out</h2>
        <p>{copy}</p>
        <span>Your bid stands at {formatBid(winningBid)}. Review the valuation before judging the win.</span>
      </div>
      <button type="button" className={styles.primaryButton} onClick={onReview}>
        <span>Review Winning Bid</span><ArrowRight aria-hidden="true" />
      </button>
    </section>
  );
}
