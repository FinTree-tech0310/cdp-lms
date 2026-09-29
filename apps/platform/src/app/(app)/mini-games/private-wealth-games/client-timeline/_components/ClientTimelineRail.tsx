import type { TimelineStop } from "../_data/client-timeline-scenarios";
import styles from "../client-timeline.module.css";

interface ClientTimelineRailProps {
  stops: readonly TimelineStop[];
  currentIndex: number;
  mode?: "preview" | "playing" | "complete";
}

export function ClientTimelineRail({
  stops,
  currentIndex,
  mode = "playing",
}: ClientTimelineRailProps) {
  const progress = mode === "complete" ? 1 : mode === "preview" ? 0 : currentIndex / 2;

  return (
    <nav className={styles.timelineRail} aria-label="Client financial timeline">
      <div className={styles.timelineTrack} aria-hidden="true">
        <span
          className={styles.timelineProgress}
          data-timeline-progress
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
      <ol>
        {stops.map((stop, index) => {
          const status =
            mode === "preview"
              ? "upcoming"
              : mode === "complete" || index < currentIndex
                ? "completed"
                : index === currentIndex
                  ? "current"
                  : "upcoming";
          return (
            <li
              key={stop.id}
              data-status={status}
              data-timeline-marker={index}
              aria-current={status === "current" ? "step" : undefined}
            >
              <span className={styles.markerDot} aria-hidden="true" />
              <span className={styles.markerCopy}>
                <small>{stop.yearMarker}</small>
                <strong>{stop.stopLabel}</strong>
                <span className={styles.srOnly}>
                  {status === "completed"
                    ? " — completed"
                    : status === "current"
                      ? " — current"
                      : " — upcoming and locked"}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
