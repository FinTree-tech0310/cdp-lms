import type { Ref } from "react";
import { LiquidityPoolIllustration } from "./LiquidityPoolIllustration";
import styles from "../liquidity-pool-balancer.module.css";

export function LiquidityPoolIntro({ ready, startRef, onStart }: {
  ready: boolean;
  startRef: Ref<HTMLButtonElement>;
  onStart: () => void;
}) {
  return (
    <section className={styles.intro} aria-labelledby="liquidity-pool-intro-title">
      <div className={styles.introArt}><LiquidityPoolIllustration /></div>
      <div className={styles.introCopy}>
        <p className={styles.eyebrow}>Future of Finance · Decentralized markets</p>
        <h1 id="liquidity-pool-intro-title">Liquidity Pool Balancer.</h1>
        <p className={styles.introDescription}>
          Choose a swap size that meets a treasury need while managing its immediate price impact.
        </p>
        <div className={styles.introBrief}>
          <p>Read the execution requirement and the pool reserves.</p>
          <p>Adjust one swap amount. The pool output and price impact update as you move it.</p>
          <p>Submit when your trade size fits the task.</p>
        </div>
        <button ref={startRef} className={styles.primaryButton} type="button" disabled={!ready} onClick={onStart}>
          Start Balancing
        </button>
      </div>
    </section>
  );
}
