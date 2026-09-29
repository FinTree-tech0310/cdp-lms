import styles from "../thesis-defense.module.css";

interface ThesisDefenseIntroProps {
  isReady: boolean;
  onStart: () => void;
}

export function ThesisDefenseIntro({
  isReady,
  onStart,
}: ThesisDefenseIntroProps) {
  return (
    <section
      className={styles.introPanel}
      aria-labelledby="thesis-defense-title"
    >
      <div className={styles.introVisual} aria-hidden="true">
        <div className={styles.meetingTable}>
          <span className={styles.pmSeat}>PM</span>
          <span className={styles.analystSeat}>ER</span>
          <div className={styles.thesisDocument}>
            <span>Published view</span>
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>

      <div className={styles.introContent}>
        <p className={styles.eyebrow}>Equity Research · Investor Meeting</p>
        <h1 id="thesis-defense-title">Defend the view you published.</h1>
        <p className={styles.introCopy}>
          A portfolio manager is testing your assumptions, evidence, risks, and
          conviction across four questions.
        </p>
        <div className={styles.introBrief}>
          <p><strong>One thesis.</strong> Four challenges.</p>
          <p>No timer. Every response locks when you commit.</p>
        </div>
        <button
          type="button"
          className={styles.primaryButton}
          disabled={!isReady}
          onClick={onStart}
        >
          {isReady ? "Enter the Meeting" : "Preparing meeting"}
        </button>
      </div>
    </section>
  );
}
