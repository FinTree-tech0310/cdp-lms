import styles from "../fraud-signal-triage.module.css";

export function FraudTriageIllustration() {
  return (
    <div className={styles.introArt} aria-hidden="true">
      <div className={styles.artTrack}>
        <span className={styles.artCardOne}><i /><i /><i /></span>
        <span className={styles.artCardTwo}><i /><i /><i /></span>
        <span className={styles.artCardThree}><i /><i /><i /></span>
        <span className={styles.artJunction} />
        <span className={styles.artRouteOne} />
        <span className={styles.artRouteTwo} />
        <span className={styles.artRouteThree} />
      </div>
    </div>
  );
}
