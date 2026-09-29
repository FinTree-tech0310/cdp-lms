import Link from "next/link";
import type { ReactNode } from "react";
import styles from "../build-the-trading-algorithm.module.css";

export function TradingFrame({ onBack, children }: { onBack?: () => void; children: ReactNode }) {
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
        <p className={styles.gameLabel}>Build the Trading Algorithm</p>
        <div />
      </header>
      {children}
    </main>
  );
}
