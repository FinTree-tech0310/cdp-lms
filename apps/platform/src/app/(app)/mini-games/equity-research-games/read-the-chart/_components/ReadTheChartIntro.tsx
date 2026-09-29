import styles from "../read-the-chart.module.css";

interface ReadTheChartIntroProps {
  isReady: boolean;
  onStart: () => void;
}

export function ReadTheChartIntro({
  isReady,
  onStart,
}: ReadTheChartIntroProps) {
  return (
    <section
      className={styles.introPanel}
      aria-labelledby="read-the-chart-title"
    >
      <div className={styles.introVisual} aria-hidden="true">
        <div className={styles.introChartCard}>
          <span className={styles.introMarker} />
          <svg viewBox="0 0 360 190" focusable="false">
            <path className={styles.introGrid} d="M20 45H340M20 95H340M20 145H340" />
            <path
              className={styles.introLine}
              d="M20 62 72 58 124 64 176 56 176 57 226 126 282 139 340 145"
            />
          </svg>
          <div className={styles.introLabels}>
            <span>Before</span>
            <span>Earnings</span>
            <span>After</span>
          </div>
        </div>
      </div>

      <div className={styles.introContent}>
        <p className={styles.eyebrow}>Equity Research · Earnings review</p>
        <h1 id="read-the-chart-title">Read what the market is telling you.</h1>
        <p className={styles.introCopy}>
          Compare the reported quarter with the price reaction, then judge what
          investors most likely learned about the outlook.
        </p>
        <div className={styles.introBrief}>
          <p><strong>One company.</strong> One earnings release.</p>
          <p>No timer. Inspect the evidence before you submit your read.</p>
        </div>
        <button
          type="button"
          className={styles.primaryButton}
          disabled={!isReady}
          onClick={onStart}
        >
          {isReady ? "Start" : "Preparing chart"}
        </button>
      </div>
    </section>
  );
}
