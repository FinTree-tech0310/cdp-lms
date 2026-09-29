import Link from "next/link";
import type { ReactNode } from "react";

import styles from "./mini-game-shell.module.css";

export interface MiniGameShellProps {
  gameLabel: string;
  hubHref: string;
  rightContent?: ReactNode;
  backLabel: string;
  onBack?: () => void;
  children: ReactNode;
}

export function MiniGameShell({
  gameLabel,
  hubHref,
  rightContent,
  backLabel,
  onBack,
  children,
}: MiniGameShellProps) {
  return (
    <main className={styles.page}>
      <header className={styles.topBar}>
        {onBack ? (
          <button type="button" className={styles.backButton} onClick={onBack}>
            <span aria-hidden="true">&larr;</span>
            <span>{backLabel}</span>
          </button>
        ) : (
          <Link href={hubHref} replace className={styles.backLink}>
            <span aria-hidden="true">&larr;</span>
            <span>{backLabel}</span>
          </Link>
        )}
        <p className={styles.gameLabel}>{gameLabel}</p>
        <div className={styles.rightContent}>{rightContent}</div>
      </header>
      {children}
    </main>
  );
}
