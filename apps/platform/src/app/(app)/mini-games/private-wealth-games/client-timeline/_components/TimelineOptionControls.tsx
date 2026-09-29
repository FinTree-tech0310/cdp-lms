import type { TimelineStopOption } from "../_data/client-timeline-scenarios";
import styles from "../client-timeline.module.css";

interface TimelineOptionControlsProps {
  options: readonly TimelineStopOption[];
  selectedOptionId: string | null;
  disabled: boolean;
  onChoose: (option: TimelineStopOption) => void;
}

export function TimelineOptionControls({
  options,
  selectedOptionId,
  disabled,
  onChoose,
}: TimelineOptionControlsProps) {
  return (
    <section className={styles.optionArea} aria-labelledby="timeline-options-title">
      <p className={styles.sectionEyebrow}>Your response</p>
      <h2 id="timeline-options-title">How do you advise the client now?</h2>
      <div className={styles.optionGrid}>
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className={styles.optionButton}
            data-selected={selectedOptionId === option.id}
            disabled={disabled}
            onClick={() => onChoose(option)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <p className={styles.optionNote}>No timer. Consider what this moment calls for.</p>
    </section>
  );
}
