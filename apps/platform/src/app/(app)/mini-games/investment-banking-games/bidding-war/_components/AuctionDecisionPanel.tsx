import { ArrowUpRight, DoorOpen } from "lucide-react";

import type { BiddingWarScenario } from "../_lib/bidding-war-types";
import { formatBid } from "../_lib/format-bid";
import styles from "../bidding-war.module.css";

interface AuctionDecisionPanelProps {
  scenario: BiddingWarScenario;
  currentLeadingBid: number;
  roundNumber: number;
  onRaise: () => void;
  onWalk: () => void;
}

export function AuctionDecisionPanel({
  scenario,
  currentLeadingBid,
  roundNumber,
  onRaise,
  onWalk,
}: AuctionDecisionPanelProps) {
  return (
    <section className={styles.auctionPanel} aria-labelledby="leading-bid-heading">
      <header>
        <p className={styles.eyebrow}>Live auction · Round {roundNumber} of {scenario.maxRounds}</p>
        <h2 id="leading-bid-heading">Current Leading Bid</h2>
      </header>
      <div className={styles.leadingBid}>{formatBid(currentLeadingBid)}</div>
      <p className={styles.leadingOwner}>The competing bidder currently leads.</p>
      <div className={styles.decisionActions}>
        <button type="button" className={styles.primaryButton} onClick={onRaise}>
          <span>Raise</span><ArrowUpRight aria-hidden="true" />
        </button>
        <button type="button" className={styles.walkButton} onClick={onWalk}>
          <DoorOpen aria-hidden="true" /> Walk Away
        </button>
      </div>
    </section>
  );
}
