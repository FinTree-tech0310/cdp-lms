"use client";

import styles from "../the-all-nighter.module.css";

export function AllNighterIntro({
  ready,
  onStart,
  onGuide,
}: {
  ready: boolean;
  onStart: () => void;
  onGuide: () => void;
}) {
  return (
    <section className={styles.intro} aria-labelledby="all-nighter-title">
      <div className={styles.introArt} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className={styles.introCopy}>
        <p className={styles.eyebrow}>Investment Banking - Deal execution</p>
        <h1 id="all-nighter-title">The All-Nighter</h1>
        <p>
          Choose what to work on while the deal team&apos;s requests continue to
          arrive.
        </p>
        <div className={styles.introBrief}>
          <strong>How it works</strong>
          <ul>
            <li>Each task takes real simulated work time.</li>
            <li>Other requests and deadlines continue while you are busy.</li>
            <li>There is one analyst and one hard session deadline.</li>
          </ul>
        </div>
        <button
          type="button"
          className={styles.primaryButton}
          disabled={!ready}
          onClick={onStart}
        >
          Start the session
        </button>
        <button type="button" className={styles.guideLauncher} onClick={onGuide}>
          How this works
        </button>
      </div>
    </section>
  );
}