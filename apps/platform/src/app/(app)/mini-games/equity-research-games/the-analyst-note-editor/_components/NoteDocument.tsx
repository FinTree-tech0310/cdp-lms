import type { Ref } from "react";

import type { AnalystNoteScenario } from "../_lib/analyst-note-types";
import styles from "../analyst-note-editor.module.css";
import { NoteLineToggle } from "./NoteLineToggle";

interface NoteDocumentProps {
  scenario: AnalystNoteScenario;
  flaggedLineIds: ReadonlySet<string>;
  headingRef: Ref<HTMLHeadingElement>;
  onToggle: (lineId: string) => void;
  onSubmit: () => void;
}

export function NoteDocument({
  scenario,
  flaggedLineIds,
  headingRef,
  onToggle,
  onSubmit,
}: NoteDocumentProps) {
  return (
    <div className={styles.reviewWorkspace}>
      <header className={styles.workspaceHeader}>
        <p className={styles.eyebrow}>Pre-publication review</p>
        <h1 ref={headingRef} tabIndex={-1}>Review the draft on its own evidence.</h1>
        <p>
          Flag any line that needs editorial challenge. Leaving a line unflagged
          is also a deliberate review decision.
        </p>
      </header>

      <div className={styles.reviewLayout}>
        <article className={styles.document} aria-labelledby="draft-note-heading">
          <header className={styles.documentHeader}>
            <div>
              <p className={styles.documentKicker}>Internal draft · Not for distribution</p>
              <h2 id="draft-note-heading">Draft Equity Research Note</h2>
            </div>
            <span className={styles.draftStamp}>Draft</span>
          </header>

          <section className={styles.noteContext} aria-labelledby="note-context-heading">
            <p id="note-context-heading" className={styles.cardLabel}>Note context</p>
            <p>{scenario.noteContext}</p>
          </section>

          <ol className={styles.noteLines} aria-label="Draft note lines">
            {scenario.lines.map((line, index) => (
              <NoteLineToggle
                key={line.id}
                line={line}
                lineNumber={index + 1}
                flagged={flaggedLineIds.has(line.id)}
                onToggle={onToggle}
              />
            ))}
          </ol>
        </article>

        <aside className={styles.editorialRail}>
          <p className={styles.cardLabel}>Your editorial task</p>
          <h2>What needs to be challenged?</h2>
          <p>
            Consider whether each statement is supported, appropriately
            qualified, and independent in tone.
          </p>
          <p className={styles.submitNote}>
            Submit is available now. Zero, some, or all lines may be flagged.
          </p>
          <button type="button" className={styles.primaryButton} onClick={onSubmit}>
            Submit Review
          </button>
        </aside>
      </div>
    </div>
  );
}
