import { ArrowRight, Handshake } from "lucide-react";

import { BorderBeam } from "@/components/ui/border-beam";

import styles from "../counteroffer.module.css";

interface CounterofferIntroProps {
  isReady: boolean;
  onStart: () => void;
}

export function CounterofferIntro({ isReady, onStart }: CounterofferIntroProps) {
  return (
    <section className={styles.intro} aria-labelledby="counteroffer-title">
      <div className={styles.introArt} aria-hidden="true">
        <div className={styles.termSheet}>
          <span>SELL-SIDE TERM SHEET</span>
          <i /><i /><i />
          <b>R1 → R2 → R3</b>
        </div>
        <div className={styles.handshakeMark}><Handshake /></div>
      </div>
      <div className={styles.introCopy}>
        <p className={styles.eyebrow}>Investment Banking · Deal negotiation</p>
        <h1 id="counteroffer-title">Keep the buyer engaged. Protect the seller&apos;s terms.</h1>
        <p>
          You are the sell-side advisor in a three-round negotiation. Adjust the
          package after each buyer response, then decide how far the seller should move.
        </p>
        <div className={styles.introBrief}>
          <strong>Your mandate</strong>
          <ul>
            <li>Shape purchase price, earn-out length, and governance.</li>
            <li>Read the buyer&apos;s authored response before revising the offer.</li>
            <li>Reach terms the buyer can accept without conceding everything.</li>
          </ul>
        </div>
        <button
          type="button"
          className={styles.primaryButton}
          disabled={!isReady}
          onClick={onStart}
        >
          <BorderBeam lightWidth={72} duration={4.2} borderWidth={2} />
          <span>{isReady ? "Open the Deal Desk" : "Preparing negotiation"}</span>
          {isReady ? <ArrowRight aria-hidden="true" /> : null}
        </button>
      </div>
    </section>
  );
}
