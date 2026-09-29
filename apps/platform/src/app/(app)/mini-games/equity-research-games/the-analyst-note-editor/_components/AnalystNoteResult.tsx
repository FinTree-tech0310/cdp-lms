import type { Ref } from "react";

import type { AnalystNoteResultSnapshot } from "../_lib/analyst-note-types";
import styles from "../analyst-note-editor.module.css";

interface AnalystNoteResultProps {
  snapshot: AnalystNoteResultSnapshot;
  headingRef: Ref<HTMLHeadingElement>;
  onTryAnother: () => void;
}

export function AnalystNoteResult({
  snapshot,
  headingRef,
  onTryAnother,
}: AnalystNoteResultProps) {
  return (
    <section className={styles.resultWorkspace} aria-labelledby="note-result-title">
      <header className={styles.resultHeader}>
        <p className={styles.resultEyebrow}>Editorial review</p>
        <h1 id="note-result-title" ref={headingRef} tabIndex={-1}>
          Review every judgment in the note.
        </h1>
        <p>
          Compare what you flagged with the authored reference review and the
          reasoning behind each line.
        </p>
      </header>

      <ol className={styles.resultLines}>
        {snapshot.lines.map((line, index) => (
          <li
            key={line.lineId}
            className={styles.resultLine}
            data-matched={line.matched}
          >
            <div className={styles.resultLineHeading}>
              <p>Line {String(index + 1).padStart(2, "0")}</p>
              <span>{line.matched ? "Matched the Review" : "Needs Another Look"}</span>
            </div>
            <blockquote>{line.text}</blockquote>
            <dl className={styles.reviewFacts}>
              <div>
                <dt>Your review</dt>
                <dd>{line.learnerFlagged ? "Flagged" : "Left Unflagged"}</dd>
              </div>
              <div>
                <dt>Reference review</dt>
                <dd>{line.isProblematic ? "Needs Edit" : "Supported as Written"}</dd>
              </div>
              <div>
                <dt>Result</dt>
                <dd>{line.matched ? "Matched the Review" : "Needs Another Look"}</dd>
              </div>
            </dl>
            <div className={styles.reasoning}>
              <p className={styles.cardLabel}>Why</p>
              <p>{line.reasoning}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className={styles.resultAction}>
        <button type="button" className={styles.primaryButton} onClick={onTryAnother}>
          Try Another
        </button>
      </div>
    </section>
  );
}
