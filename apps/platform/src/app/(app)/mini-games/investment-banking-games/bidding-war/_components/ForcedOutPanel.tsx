import { DoorOpen, LockKeyhole } from "lucide-react";

import type { ForcedOutReason } from "../_lib/bidding-war-types";
import { formatBid } from "../_lib/format-bid";
import styles from "../bidding-war.module.css";

export function ForcedOutPanel({
  competitorBid,
  reason,
  onExit,
}: {
  competitorBid: number;
  reason: ForcedOutReason;
  onExit: () => void;
}) {
  return (
    <section className={styles.forcedPanel} aria-labelledby="forced-heading">
      <div className={styles.responseIcon}><LockKeyhole aria-hidden="true" /></div>
      <div>
        <p className={styles.eyebrow}>Competitor leads at {formatBid(competitorBid)}</p>
        <h2 id="forced-heading" tabIndex={-1}>No legal raise remains</h2>
        <p>
          {reason === "budget"
            ? "The next required bid would exceed your client's maximum authorization."
            : "The competitor countered after your final permitted raise round. There is no additional learner bid."}
        </p>
      </div>
      <button type="button" className={styles.primaryButton} onClick={onExit}>
        <span>Exit Auction</span><DoorOpen aria-hidden="true" />
      </button>
    </section>
  );
}
