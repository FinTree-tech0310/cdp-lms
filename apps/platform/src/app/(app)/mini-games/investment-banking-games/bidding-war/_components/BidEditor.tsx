import { ArrowLeft, Send } from "lucide-react";

import type { BiddingWarScenario } from "../_lib/bidding-war-types";
import { formatBid } from "../_lib/format-bid";
import { getMinimumLegalRaise } from "../_lib/bidding-war-resolution";
import styles from "../bidding-war.module.css";

interface BidEditorProps {
  scenario: BiddingWarScenario;
  currentLeadingBid: number;
  proposedBid: number;
  onChange: (value: number) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export function BidEditor({
  scenario,
  currentLeadingBid,
  proposedBid,
  onChange,
  onCancel,
  onSubmit,
}: BidEditorProps) {
  const minimumBid = getMinimumLegalRaise(currentLeadingBid, scenario.minIncrement);
  return (
    <section className={styles.bidEditor} aria-labelledby="next-bid-heading">
      <header>
        <div>
          <p className={styles.eyebrow}>Raise selected</p>
          <h3 id="next-bid-heading">Set your next bid</h3>
        </div>
        <strong>{formatBid(proposedBid)}</strong>
      </header>
      <dl className={styles.bidBounds}>
        <div><dt>Minimum next bid</dt><dd>{formatBid(minimumBid)}</dd></div>
        <div><dt>Maximum authorization</dt><dd>{formatBid(scenario.learnerMaxAuthorizedBid)}</dd></div>
      </dl>
      <label className={styles.rangeLabel} htmlFor="bidding-war-bid">
        Current proposed bid
      </label>
      <input
        id="bidding-war-bid"
        className={styles.rangeInput}
        type="range"
        min={minimumBid}
        max={scenario.learnerMaxAuthorizedBid}
        step={scenario.bidStep}
        value={proposedBid}
        aria-valuetext={formatBid(proposedBid)}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <div className={styles.rangeEnds} aria-hidden="true">
        <span>{formatBid(minimumBid)}</span>
        <span>{formatBid(scenario.learnerMaxAuthorizedBid)}</span>
      </div>
      <div className={styles.editorActions}>
        <button type="button" className={styles.secondaryButton} onClick={onCancel}>
          <ArrowLeft aria-hidden="true" /> Back
        </button>
        <button type="button" className={styles.primaryButton} onClick={onSubmit}>
          <span>Submit Bid</span><Send aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
