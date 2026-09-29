import Link from "next/link";
import type { ReactNode } from "react";

import styles from "../read-the-order-book.module.css";

interface OrderBookFrameProps {
  onBack?: () => void;
  children: ReactNode;
}

export function OrderBookFrame({ onBack, children }: OrderBookFrameProps) {
  return (
    <main className={styles.page}>
      <header className={styles.topBar}>
        <div>
          {onBack ? (
            <button className={styles.backButton} type="button" onClick={onBack}>
              <span aria-hidden="true">←</span> Back to introduction
            </button>
          ) : (
            <Link className={styles.backButton} href="/mini-games/future-of-finance-games" replace>
              <span aria-hidden="true">←</span> Future of Finance Games
            </Link>
          )}
        </div>
        <p className={styles.gameLabel}>Read the Order Book</p>
        <div />
      </header>
      {children}
    </main>
  );
}
