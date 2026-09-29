import { ArrowRight, Gavel } from "lucide-react";

import { BorderBeam } from "@/components/ui/border-beam";

import styles from "../bidding-war.module.css";

interface BiddingWarIntroProps {
  isReady: boolean;
  onStart: () => void;
}

export function BiddingWarIntro({ isReady, onStart }: BiddingWarIntroProps) {
  return (
    <section className={styles.intro} aria-labelledby="bidding-war-title">
      <div className={styles.introArt} aria-hidden="true">
        <div className={styles.bidSheet}>
          <span>LIVE DEAL PROCESS</span>
          <strong>$100M</strong>
          <i /><i /><i />
          <b>RAISE · HOLD DISCIPLINE · WALK</b>
        </div>
        <div className={styles.gavelMark}><Gavel /></div>
      </div>
      <div className={styles.introCopy}>
        <p className={styles.eyebrow}>Investment Banking · Auction strategy</p>
        <h1 id="bidding-war-title">Winning the auction is not the same as creating value.</h1>
        <p>
          Advise your client through a competitive sale process. Raise within your
          authorization—or walk away before competitive pressure turns into overpayment.
        </p>
        <div className={styles.introBrief}>
          <strong>Your assignment</strong>
          <ul>
            <li>Track the live leading bid and your client&apos;s hard ceiling.</li>
            <li>Choose how much to raise without knowing the competitor&apos;s limit.</li>
            <li>Recognize that a disciplined exit can be better than an expensive win.</li>
          </ul>
        </div>
        <button
          type="button"
          className={styles.primaryButton}
          disabled={!isReady}
          onClick={onStart}
        >
          <BorderBeam lightWidth={72} duration={4.2} borderWidth={2} />
          <span>{isReady ? "Enter the Auction" : "Preparing auction"}</span>
          {isReady ? <ArrowRight aria-hidden="true" /> : null}
        </button>
      </div>
    </section>
  );
}
