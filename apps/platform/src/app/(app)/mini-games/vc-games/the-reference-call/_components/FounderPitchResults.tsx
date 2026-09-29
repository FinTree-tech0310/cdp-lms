"use client";

import { forwardRef } from "react";

import { VcPrimaryButton } from "../../_components/VcPrimaryButton";
import type { FounderPitchTranscript, PitchJudgment } from "../_data/founder-pitch-transcripts";
import { useResultsEntrance } from "../_hooks/use-results-entrance";
import { calculateFounderPitchResult, getFounderReplayState, type FounderReplayState } from "../_lib/founder-pitch-results";
import styles from "../the-reference-call.module.css";

interface FounderPitchResultsProps { transcript: FounderPitchTranscript; judgments: Readonly<Record<string, PitchJudgment>>; onTryAnother: () => void; }

const LABELS: Record<FounderReplayState, string> = {
  "green-caught": "Green — Caught", "red-caught": "Red — Caught", "missed-green": "Missed Green", "missed-red": "Missed Red", "false-green": "False Green Flag", "false-red": "False Red Flag", "wrong-direction": "Wrong Direction", neutral: "Neutral",
};

export const FounderPitchResults = forwardRef<HTMLHeadingElement, FounderPitchResultsProps>(function FounderPitchResults({ transcript, judgments, onTryAnother }, ref) {
  const result = calculateFounderPitchResult(transcript, judgments);
  const resultsRef = useResultsEntrance();
  return (
    <section ref={resultsRef} className={styles.resultsStage} aria-labelledby="pitch-results-title">
      <div className={styles.resultsHero} data-review-summary><p className={styles.eyebrow}>Pitch review</p><h1 id="pitch-results-title" ref={ref} tabIndex={-1}>You correctly read {result.correctSignals} of {result.meaningfulSignals} meaningful signals.</h1>
        <div className={styles.resultStats} aria-label="Founder pitch results"><p data-review-stat><strong>{result.correctGreen}</strong><span>Green caught</span></p><p data-review-stat><strong>{result.correctRed}</strong><span>Red caught</span></p><p data-review-stat><strong>{result.missedSignals}</strong><span>Missed</span></p><p data-review-stat><strong>{result.falseGreenFlags}</strong><span>False green</span></p><p data-review-stat><strong>{result.falseRedFlags}</strong><span>False red</span></p><p data-review-stat><strong>{result.wrongDirection}</strong><span>Wrong direction</span></p></div>
      </div>
      <div className={styles.replayHeader} data-review-heading><div><p className={styles.eyebrow}>Full pitch replay</p><h2>What the founder was signaling</h2></div><p>Compare each judgment with the authored signals. Neutral statements needed no action.</p></div>
      <div className={styles.replayList}>{transcript.lines.map((line) => { const replayState = getFounderReplayState(line, judgments[line.id]); return <article key={line.id} className={styles.replayLine} data-state={replayState} data-review-line><div className={styles.replayMeta}><span>{line.speaker}</span><strong>{LABELS[replayState]}</strong></div><p className={styles.replayText}>{line.text}</p>{line.signalType !== "neutral" ? <div className={styles.whyItMatters}><span>Why it mattered</span><p>{line.whyItMatters}</p></div> : null}</article>; })}</div>
      <div className={styles.resultsAction} data-review-action><VcPrimaryButton beam spacing="roomy" onClick={onTryAnother}>Try Another</VcPrimaryButton></div>
    </section>
  );
});
