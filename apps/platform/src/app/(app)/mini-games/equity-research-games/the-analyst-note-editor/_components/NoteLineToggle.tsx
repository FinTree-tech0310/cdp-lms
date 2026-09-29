import type { NoteLine } from "../_lib/analyst-note-types";
import styles from "../analyst-note-editor.module.css";

interface NoteLineToggleProps {
  line: NoteLine;
  lineNumber: number;
  flagged: boolean;
  onToggle: (lineId: string) => void;
}

export function NoteLineToggle({
  line,
  lineNumber,
  flagged,
  onToggle,
}: NoteLineToggleProps) {
  const lineLabel = String(lineNumber).padStart(2, "0");
  const action = flagged ? "Remove review flag from" : "Flag";

  return (
    <li className={styles.noteLine} data-flagged={flagged || undefined}>
      <span className={styles.lineNumber} aria-hidden="true">{lineLabel}</span>
      <button
        type="button"
        className={styles.lineToggle}
        aria-pressed={flagged}
        aria-label={`${action} line ${lineNumber}: ${line.text}`}
        onClick={() => onToggle(line.id)}
      >
        <span className={styles.lineText}>{line.text}</span>
        <span className={styles.flagState} aria-hidden="true">
          <span className={styles.flagMark} />
          {flagged ? "Flagged for review" : "Flag for review"}
        </span>
      </button>
    </li>
  );
}
