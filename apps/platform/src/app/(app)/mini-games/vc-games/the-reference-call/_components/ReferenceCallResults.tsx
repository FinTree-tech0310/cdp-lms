"use client";

import { forwardRef } from "react";

import { VcPrimaryButton } from "../../_components/VcPrimaryButton";
import type { ReferenceCallTranscript } from "../_data/reference-call-transcripts";
import {
  calculateReferenceCallResult,
  getReplayLineState,
  type ReplayLineState,
} from "../_lib/reference-call-results";
import { useResultsEntrance } from "../_hooks/use-results-entrance";
import styles from "../the-reference-call.module.css";

interface ReferenceCallResultsProps {
  transcript: ReferenceCallTranscript;
  flaggedLineIds: readonly string[];
  onTryAnother: () => void;
}

const REPLAY_LABELS: Record<ReplayLineState, string> = {
  caught: "Caught",
  missed: "Missed",
  clean: "Clean",
  "false-flag": "False Flag",
};

export const ReferenceCallResults = forwardRef<HTMLHeadingElement, ReferenceCallResultsProps>(
  function ReferenceCallResults({ transcript, flaggedLineIds, onTryAnother }, ref) {
    const result = calculateReferenceCallResult(transcript, flaggedLineIds);
    const flaggedIds = new Set(flaggedLineIds);
    const resultsRef = useResultsEntrance();

    return (
      <section
        ref={resultsRef}
        className={styles.resultsStage}
        aria-labelledby="reference-results-title"
      >
        <div className={styles.resultsHero} data-review-summary>
          <p className={styles.eyebrow}>Call review</p>
          <h1 id="reference-results-title" ref={ref} tabIndex={-1}>
            You caught {result.caught} of {result.totalRedFlags} warning signs.
          </h1>
          <div className={styles.resultStats} aria-label="Reference call results">
            <p data-review-stat><strong>{result.caught}</strong><span>Caught</span></p>
            <p data-review-stat><strong>{result.missed}</strong><span>Missed</span></p>
            <p data-review-stat><strong>{result.falseFlags}</strong><span>False Flags</span></p>
          </div>
        </div>

        <div className={styles.replayHeader} data-review-heading>
          <div>
            <p className={styles.eyebrow}>Full transcript replay</p>
            <h2>What the reference was really signaling</h2>
          </div>
          <p>Review every call you made against the authored diligence signals.</p>
        </div>

        <div className={styles.replayList}>
          {transcript.lines.map((line) => {
            const replayState = getReplayLineState(line, flaggedIds);
            return (
              <article
                key={line.id}
                className={styles.replayLine}
                data-state={replayState}
                data-review-line
              >
                <div className={styles.replayMeta}>
                  <span>{line.speaker}</span>
                  <strong>{REPLAY_LABELS[replayState]}</strong>
                </div>
                <p className={styles.replayText}>{line.text}</p>
                {line.isRedFlag ? (
                  <div className={styles.whyItMatters}>
                    <span>Why it mattered</span>
                    <p>{line.whyItMatters}</p>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>

        <div className={styles.resultsAction} data-review-action>
          <VcPrimaryButton beam spacing="roomy" onClick={onTryAnother}>
            Try Another
          </VcPrimaryButton>
        </div>
      </section>
    );
  },
);
