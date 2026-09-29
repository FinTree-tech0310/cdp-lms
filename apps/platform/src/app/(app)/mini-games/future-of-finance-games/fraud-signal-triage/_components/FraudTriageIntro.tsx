import { FraudTriageIllustration } from "./FraudTriageIllustration";
import styles from "../fraud-signal-triage.module.css";

interface FraudTriageIntroProps {
  ready: boolean;
  onStart: () => void;
  startRef: React.Ref<HTMLButtonElement>;
}

export function FraudTriageIntro({ ready, onStart, startRef }: FraudTriageIntroProps) {
  return (
    <section className={styles.intro} aria-labelledby="fraud-triage-intro-title">
      <FraudTriageIllustration />
      <div className={styles.introCopy}>
        <p className={styles.eyebrow}>Future of Finance · Payments risk</p>
        <h1 id="fraud-triage-intro-title">Review the signal. Route the decision.</h1>
        <p className={styles.introDescription}>
          Work through a transaction review queue. Weigh the signals, then choose
          how each payment should be handled.
        </p>
        <div className={styles.introBrief}>
          <p>Review every transaction before submitting the queue.</p>
          <p>You can change any decision before Submit Review. There is no timer.</p>
        </div>
        <button ref={startRef} className={styles.primaryButton} type="button" disabled={!ready} onClick={onStart}>
          {ready ? "Start Review" : "Preparing review"}
        </button>
      </div>
    </section>
  );
}
