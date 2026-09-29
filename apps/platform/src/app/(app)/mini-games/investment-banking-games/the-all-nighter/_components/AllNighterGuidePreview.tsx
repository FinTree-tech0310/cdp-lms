import { formatRemaining } from "../_lib/all-nighter-engine";
import type { AllNighterScenario } from "../_lib/all-nighter-types";
import styles from "../the-all-nighter.module.css";

export function AllNighterGuidePreview({
  scenario,
}: {
  scenario: AllNighterScenario | null;
}) {
  const task = scenario?.taskSchedule[0];
  const sessionDuration = scenario?.sessionDurationSeconds ?? 90;
  const urgency = task?.urgencyLabel ?? "MD is waiting";
  const description = task?.description ?? "Check client-facing model numbers";
  const workDuration = task?.workDurationSeconds ?? 8;
  const hasDeadline = task?.expiresAfterSeconds != null;
  const startWithin = task?.expiresAfterSeconds ?? 20;

  return (
    <section className={styles.guidePreview} aria-label="All-Nighter interface preview">
      <header className={styles.guidePreviewHeader}>
        <div>
          <p className={styles.eyebrow}>Live deal queue</p>
          <h1>The All-Nighter</h1>
          <p>{scenario?.dealContextNote ?? "Preview the live analyst work queue before the shift begins."}</p>
        </div>
        <div className={styles.sessionTimer} data-all-nighter-guide="session-timer">
          <span>Session remaining</span>
          <strong>{formatRemaining(sessionDuration * 1000)}</strong>
        </div>
      </header>

      <div className={styles.grid}>
        <section className={styles.queue} data-all-nighter-guide="queue" aria-labelledby="guide-preview-queue">
          <header>
            <p className={styles.eyebrow}>Incoming work</p>
            <h2 id="guide-preview-queue">Waiting queue</h2>
            <p>Requests will appear here during the live session.</p>
          </header>
          <div className={styles.taskList}>
            <article className={styles.taskCard} data-all-nighter-guide="task-card">
              <p className={styles.urgency}>{urgency}</p>
              <h3>{description}</h3>
              <dl>
                <div>
                  <dt>Est. work</dt>
                  <dd>{workDuration} sec</dd>
                </div>
                <div>
                  <dt>{hasDeadline ? "Start within" : "No hard deadline"}</dt>
                  <dd>{hasDeadline ? formatRemaining(startWithin * 1000) : "No hard deadline"}</dd>
                </div>
              </dl>
              <button type="button" className={styles.handleButton} disabled>
                Handle
              </button>
            </article>
          </div>
        </section>

        <aside className={styles.activePanel} data-all-nighter-guide="handle-and-active" aria-labelledby="guide-preview-active">
          <p className={styles.eyebrow}>Currently working on</p>
          <h2 id="guide-preview-active">Model review</h2>
          <p>Time to complete</p>
          <strong>00:05</strong>
        </aside>
      </div>
    </section>
  );
}
