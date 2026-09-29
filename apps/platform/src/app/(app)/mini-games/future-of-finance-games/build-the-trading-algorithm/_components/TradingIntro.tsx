import type { Ref } from "react";
import { TradingIllustration } from "./TradingIllustration";
import styles from "../build-the-trading-algorithm.module.css";

export function TradingIntro({ ready, startRef, onStart }: { ready: boolean; startRef: Ref<HTMLButtonElement>; onStart: () => void }) {
  return (
    <section className={styles.intro} aria-labelledby="trading-intro-title">
      <div className={styles.introArt}><TradingIllustration /></div>
      <div className={styles.introCopy}>
        <p className={styles.eyebrow}>Future of Finance · Algorithmic trading</p>
        <h1 id="trading-intro-title">Build the Trading Algorithm.</h1>
        <p className={styles.introDescription}>Choose an entry rule and an exit rule. Then see how those explicit rules behave when run through an unseen market period.</p>
        <div className={styles.introBrief}>
          <p>One position at a time. One entry rule. One exit rule.</p>
          <p>The backtest shows mechanical consequences, not a score or a “best” strategy.</p>
        </div>
        <button ref={startRef} className={styles.primaryButton} type="button" disabled={!ready} onClick={onStart}>Start</button>
      </div>
    </section>
  );
}
