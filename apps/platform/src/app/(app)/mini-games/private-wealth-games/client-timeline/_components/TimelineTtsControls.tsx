import styles from "../client-timeline.module.css";

const SPEECH_RATES = [0.9, 1, 1.2, 1.4] as const;

interface TimelineTtsControlsProps {
  isSupported: boolean;
  isEnabled: boolean;
  isSpeaking: boolean;
  speechRate: number;
  disabled?: boolean;
  onToggle: () => void;
  onRateChange: (rate: number) => void;
}

export function TimelineTtsControls({
  isSupported,
  isEnabled,
  isSpeaking,
  speechRate,
  disabled = false,
  onToggle,
  onRateChange,
}: TimelineTtsControlsProps) {
  return (
    <div className={styles.voiceControls}>
      <button
        type="button"
        className={styles.ttsButton}
        aria-pressed={isEnabled}
        disabled={!isSupported || disabled}
        onClick={onToggle}
      >
        <span className={styles.voiceBars} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        {!isSupported
          ? "Read aloud unavailable"
          : isEnabled
            ? isSpeaking
              ? "Reading aloud"
              : "Read aloud on"
            : "Read aloud"}
      </button>
      <label className={styles.rateControl}>
        <span>Speed</span>
        <select
          value={speechRate}
          disabled={!isSupported || disabled}
          aria-label="Read aloud speed"
          onChange={(event) => onRateChange(Number(event.currentTarget.value))}
        >
          {SPEECH_RATES.map((rate) => (
            <option key={rate} value={rate}>
              {rate.toFixed(1)}×{rate === 1.2 ? " default" : ""}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
