import styles from "../smart-contract-audit.module.css";

export function SmartContractIllustration() {
  return (
    <svg className={styles.introIllustration} viewBox="0 0 520 390" role="img" aria-hidden="true" focusable="false">
      <rect x="54" y="39" width="412" height="312" rx="24" className={styles.artBoard} />
      <rect x="54" y="39" width="412" height="52" rx="24" className={styles.artHeader} />
      <circle cx="87" cy="66" r="8" className={styles.artDot} />
      <circle cx="114" cy="66" r="8" className={styles.artDot} />
      <circle cx="141" cy="66" r="8" className={styles.artDot} />
      <rect x="91" y="123" width="45" height="17" rx="6" className={styles.artNumber} />
      <rect x="154" y="123" width="226" height="17" rx="6" className={styles.artLine} />
      <rect x="91" y="163" width="45" height="17" rx="6" className={styles.artNumber} />
      <rect x="174" y="163" width="167" height="17" rx="6" className={styles.artLine} />
      <rect x="78" y="199" width="364" height="48" rx="12" className={styles.artSelected} />
      <rect x="91" y="215" width="45" height="17" rx="6" className={styles.artNumber} />
      <rect x="174" y="215" width="207" height="17" rx="6" className={styles.artInkLine} />
      <rect x="91" y="266" width="45" height="17" rx="6" className={styles.artNumber} />
      <rect x="174" y="266" width="147" height="17" rx="6" className={styles.artLine} />
      <path d="M377 286v36h-77" className={styles.artRoute} />
      <circle cx="300" cy="322" r="12" className={styles.artRouteDot} />
    </svg>
  );
}
