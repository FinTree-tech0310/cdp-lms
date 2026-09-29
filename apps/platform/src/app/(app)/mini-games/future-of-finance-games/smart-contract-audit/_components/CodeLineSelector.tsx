import type { CodeLine } from "../_lib/smart-contract-types";
import styles from "../smart-contract-audit.module.css";

interface CodeLineSelectorProps {
  lines: readonly CodeLine[];
  selectedLineId: string | null;
  confirmedLineId: string | null;
  onSelect: (lineId: string) => void;
}

export function CodeLineSelector({ lines, selectedLineId, confirmedLineId, onSelect }: CodeLineSelectorProps) {
  const locked = confirmedLineId !== null;
  return (
    <fieldset className={styles.codeFieldset} disabled={locked}>
      <legend>{locked ? "Your confirmed line" : "Select the vulnerable line"}</legend>
      <p className={styles.mobileCodeHint}>Scroll the code sideways to read every complete line.</p>
      <div className={styles.codePanel} role="region" aria-label="Scrollable pseudocode lines" tabIndex={0}>
        {lines.map((line) => (
          <label className={styles.codeRow} key={line.id}>
            <input
              type="radio"
              name="smart-contract-line"
              value={line.id}
              aria-label={`Line ${line.lineNumber}: ${line.code.trim()}`}
              checked={(locked ? confirmedLineId : selectedLineId) === line.id}
              onChange={() => onSelect(line.id)}
            />
            <span className={styles.codeRowSurface}>
              <span className={styles.codeRadio} aria-hidden="true" />
              <span className={styles.lineNumber} aria-hidden="true">{String(line.lineNumber).padStart(2, "0")}</span>
              <code>{line.code}</code>
              {locked && confirmedLineId === line.id ? (
                <span className={styles.confirmedTag} aria-hidden="true">Your confirmed line</span>
              ) : null}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
