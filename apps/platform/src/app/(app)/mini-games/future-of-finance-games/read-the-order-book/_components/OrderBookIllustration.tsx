import styles from "../read-the-order-book.module.css";

export function OrderBookIllustration() {
  return (
    <div className={styles.introArt} aria-hidden="true">
      <svg className={styles.introIllustration} viewBox="0 0 480 380" focusable="false">
        <rect x="45" y="39" width="390" height="303" rx="25" className={styles.artBoard} />
        <rect x="76" y="72" width="327" height="39" rx="9" className={styles.artHeading} />
        <rect x="87" y="133" width="185" height="20" rx="8" className={styles.artSellBar} />
        <rect x="87" y="165" width="96" height="20" rx="8" className={styles.artSellBar} />
        <rect x="87" y="197" width="235" height="20" rx="8" className={styles.artSellBar} />
        <line x1="75" y1="238" x2="405" y2="238" className={styles.artDivider} />
        <circle cx="351" cy="238" r="25" className={styles.artPrice} />
        <rect x="87" y="263" width="216" height="20" rx="8" className={styles.artBuyBar} />
        <rect x="87" y="295" width="122" height="20" rx="8" className={styles.artBuyBar} />
        <circle cx="94" cy="88" r="5" className={styles.artDot} />
        <circle cx="111" cy="88" r="5" className={styles.artDot} />
        <circle cx="128" cy="88" r="5" className={styles.artDot} />
      </svg>
    </div>
  );
}
