import { BriefcaseBusiness, ShieldCheck } from "lucide-react";

import type { BiddingWarScenario } from "../_lib/bidding-war-types";
import { formatBid } from "../_lib/format-bid";
import styles from "../bidding-war.module.css";

export function AuctionReferencePanel({
  scenario,
}: {
  scenario: BiddingWarScenario;
}) {
  return (
    <aside className={styles.referenceRail} aria-label="Auction reference">
      <section className={styles.assetCard}>
        <div className={styles.panelHeading}>
          <BriefcaseBusiness aria-hidden="true" />
          <div><p>Asset</p><h2>{scenario.assetName}</h2></div>
        </div>
        <p>{scenario.dealContext}</p>
      </section>
      <section className={styles.authorizationCard}>
        <div className={styles.panelHeading}>
          <ShieldCheck aria-hidden="true" />
          <div><p>Client authorization</p><h2>Maximum Bid</h2></div>
        </div>
        <strong>{formatBid(scenario.learnerMaxAuthorizedBid)}</strong>
        <p>This is a hard ceiling. You cannot submit a bid above it.</p>
      </section>
    </aside>
  );
}
