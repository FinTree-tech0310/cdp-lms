import type { CSSProperties, Key } from "react";

import styles from "./countdown-bar.module.css";

interface CountdownBarProps {
  durationMs: number;
  restartKey: Key;
  stopped: boolean;
  label: string;
  emphasizeReset?: boolean;
}

export function CountdownBar({
  durationMs,
  restartKey,
  stopped,
  label,
  emphasizeReset = false,
}: CountdownBarProps) {
  const timerStyle = {
    "--countdown-duration": `${durationMs}ms`,
  } as CSSProperties;

  return (
    <div
      className={`${styles.timerTrack} ${emphasizeReset ? styles.emphasizedTrack : ""}`}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={durationMs / 1_000}
      aria-valuetext={`${durationMs / 1_000} seconds to make a decision`}
    >
      <div
        key={restartKey}
        className={`${styles.timerBar} ${emphasizeReset ? styles.emphasizedReset : ""} ${stopped ? styles.timerStopped : ""}`}
        style={timerStyle}
      />
    </div>
  );
}
