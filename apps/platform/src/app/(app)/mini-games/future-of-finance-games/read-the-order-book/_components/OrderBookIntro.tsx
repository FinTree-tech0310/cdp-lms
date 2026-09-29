import type { Ref } from "react";

import { OrderBookIllustration } from "./OrderBookIllustration";
import styles from "../read-the-order-book.module.css";

interface OrderBookIntroProps {
  ready: boolean;
  startRef: Ref<HTMLButtonElement>;
  onStart: () => void;
}

export function OrderBookIntro({ ready, startRef, onStart }: OrderBookIntroProps) {
  return (
    <section className={styles.intro} aria-labelledby="order-book-intro-title">
      <OrderBookIllustration />
      <div className={styles.introCopy}>
        <p className={styles.eyebrow}>Future of Finance · Market structure</p>
        <h1 id="order-book-intro-title">See the depth behind the price.</h1>
        <p className={styles.introDescription}>
          Read a displayed order book and decide what its available liquidity says
          about immediate execution.
        </p>
        <div className={styles.introBrief}>
          <p>Compare sell and buy depth around the current price.</p>
          <p>Choose one interpretation. You can change your read before submitting; there is no timer.</p>
        </div>
        <button
          ref={startRef}
          className={styles.primaryButton}
          type="button"
          disabled={!ready}
          onClick={onStart}
        >
          {ready ? "Start Reading" : "Preparing book"}
        </button>
      </div>
    </section>
  );
}
