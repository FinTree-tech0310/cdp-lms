import Link from "next/link";
import type { ReactNode } from "react";

import styles from "../smart-contract-audit.module.css";

interface SmartContractFrameProps {
  onBack?: () => void;
  children: ReactNode;
}

export function SmartContractFrame({ onBack, children }: SmartContractFrameProps) {
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
        <p className={styles.gameLabel}>Smart Contract Audit</p>
        <div />
      </header>
      {children}
    </main>
  );
}
