import { ArrowRight, DoorOpen, Scale, Trophy } from "lucide-react";

import type {
  AuctionRoundHistory,
  BiddingWarOutcome,
  BiddingWarScenario,
} from "../_lib/bidding-war-types";
import { formatBid } from "../_lib/format-bid";
import { getOutcomeCopy } from "../_lib/bidding-war-resolution";
import { AuctionHistory } from "./AuctionHistory";
import styles from "../bidding-war.module.css";

const LABELS: Record<BiddingWarOutcome, string> = {
  "won-reasonable": "Won — Disciplined Price",
  "won-overpaid": "Won — But Overpaid",
  "lost-to-competitor": "Lost to Competitor",
  "walked-away": "Walked Away",
};

export function BiddingWarEnding({
  scenario,
  outcome,
  winningBid,
  history,
  onTryAnother,
}: {
  scenario: BiddingWarScenario;
  outcome: BiddingWarOutcome;
  winningBid: number | null;
  history: readonly AuctionRoundHistory[];
  onTryAnother: () => void;
}) {
  const isWin = outcome === "won-reasonable" || outcome === "won-overpaid";
  return (
    <div className={styles.endingPage}>
      <section className={styles.endingHero} data-outcome={outcome} aria-labelledby="ending-heading">
        <div className={styles.endingIcon}>
          {isWin ? <Trophy aria-hidden="true" /> : outcome === "walked-away" ? <DoorOpen aria-hidden="true" /> : <Scale aria-hidden="true" />}
        </div>
        <div>
          <p className={styles.eyebrow}>Final auction outcome</p>
          <h1 id="ending-heading" tabIndex={-1}>{LABELS[outcome]}</h1>
          <p>{getOutcomeCopy(scenario, outcome)}</p>
        </div>
      </section>

      {isWin && winningBid !== null ? (
        <section className={styles.valuationReveal} aria-label="Winning bid valuation review">
          <div><span>Your winning bid</span><strong>{formatBid(winningBid)}</strong></div>
          <div><span>Internal valuation reference</span><strong>{formatBid(scenario.assetReferenceValue)}</strong></div>
        </section>
      ) : null}

      <AuctionHistory history={history} startingBid={scenario.startingBid} complete />
      <div className={styles.endingActions}>
        <button type="button" className={styles.primaryButton} onClick={onTryAnother}>
          <span>Try Another</span><ArrowRight aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
