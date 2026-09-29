"use client";

import type { FounderPitchVideo } from "../_data/founder-pitch-videos";
import styles from "../founder-interrogation.module.css";

interface PitchLibraryProps {
  pitches: readonly FounderPitchVideo[];
  watchedPitchIds: readonly string[];
  onOpen: (pitchId: string) => void;
}

function getPitchLabel(index: number) {
  return `Pitch ${String(index + 1).padStart(2, "0")}`;
}

export function PitchLibrary({ pitches, watchedPitchIds, onOpen }: PitchLibraryProps) {
  const watchedIds = new Set(watchedPitchIds);

  return (
    <section className={styles.library} aria-labelledby="pitch-library-title">
      <header className={styles.libraryHeader}>
        <p className={styles.eyebrow}>Anonymous pitch library</p>
        <h1 id="pitch-library-title">Watch the pitch. Make the call.</h1>
        <p>
          Choose any available founder pitch. Company identities stay hidden until after your
          decision.
        </p>
      </header>

      <div className={styles.pitchGrid} aria-label="Available anonymous founder pitches">
        {pitches.map((pitch, index) => {
          const label = getPitchLabel(index);
          const isWatched = watchedIds.has(pitch.id);
          return (
            <button
              key={pitch.id}
              type="button"
              className={styles.pitchCard}
              onClick={() => onOpen(pitch.id)}
              aria-label={`${label}${isWatched ? ", watched" : ""}`}
            >
              <span
                className={styles.pitchPreview}
                style={pitch.thumbnailUrl ? { backgroundImage: `url(${pitch.thumbnailUrl})` } : undefined}
                aria-hidden="true"
              >
                <span>Anonymous pitch</span>
              </span>
              <span className={styles.pitchCardFooter}>
                <strong>{label}</strong>
                {isWatched ? <span className={styles.watchedBadge}>Watched</span> : null}
              </span>
              <span className={styles.watchPrompt}>Watch pitch <span aria-hidden="true">→</span></span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
