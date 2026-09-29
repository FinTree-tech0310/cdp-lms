"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

import type { FounderPitchTranscript, PitchJudgment } from "../_data/founder-pitch-transcripts";
import type { ReferenceCallTranscript } from "../_data/reference-call-transcripts";
import type { ReferenceGameMode } from "../_lib/reference-call-state";
import styles from "../the-reference-call.module.css";

interface LiveTranscriptProps {
  mode: ReferenceGameMode;
  transcript: ReferenceCallTranscript | FounderPitchTranscript;
  activeLineIndex: number;
  flaggedLineIds: readonly string[];
  pitchJudgments: Readonly<Record<string, PitchJudgment>>;
  onFlag: (lineId: string) => void;
  onJudge: (lineId: string, judgment: PitchJudgment) => void;
  onAdvance: () => void;
}

const LIVE_POSITION_THRESHOLD_PX = 96;

export function LiveTranscript({ mode, transcript, activeLineIndex, flaggedLineIds, pitchJudgments, onFlag, onJudge, onAdvance }: LiveTranscriptProps) {
  const stageRef = useRef<HTMLElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const shouldFollowLiveRef = useRef(true);
  const visibleLines = transcript.lines.slice(0, activeLineIndex + 1);
  const isPitch = mode === "founder-pitch";
  const activeLine = transcript.lines[activeLineIndex];
  const isActiveRespondent = activeLine?.speaker === (isPitch ? "Founder" : "Reference");
  const activeLineIsFlagged = activeLine ? flaggedLineIds.includes(activeLine.id) : false;
  const activeJudgment = activeLine ? pitchJudgments[activeLine.id] : undefined;

  useLayoutEffect(() => {
    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        const stage = stageRef.current;
        if (!stage) return;
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const top = window.scrollY + stage.getBoundingClientRect().top - 8;
        window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
  }, [mode, transcript.id]);

  useEffect(() => {
    const element = transcriptRef.current;
    if (element && shouldFollowLiveRef.current) element.scrollTo({ top: element.scrollHeight, behavior: "auto" });
  }, [activeLineIndex]);

  const updateFollowMode = () => {
    const element = transcriptRef.current;
    if (!element) return;
    shouldFollowLiveRef.current = element.scrollHeight - element.scrollTop - element.clientHeight <= LIVE_POSITION_THRESHOLD_PX;
  };

  return (
    <section ref={stageRef} className={styles.callStage} aria-labelledby="live-call-title">
      <div className={styles.callHeader}>
        <div><p className={styles.eyebrow}>{isPitch ? "Live founder pitch" : "Live reference call"}</p><h1 id="live-call-title">{isPitch ? transcript.founderName : `Diligencing ${transcript.founderName}`}</h1></div>
        <p className={styles.liveStatus}><span aria-hidden="true" /> Live</p>
      </div>
      <p className={styles.liveInstruction}>{isPitch ? "Judge the newest Founder line within five seconds, or move on as soon as you're ready." : "Flag the newest Reference line within five seconds, or move on as soon as you're ready."}</p>
      <div className={styles.liveToolbar} aria-label="Live transcript shortcuts">
        {isPitch ? (
          <>
            <button type="button" disabled={!isActiveRespondent || Boolean(activeJudgment)} onClick={() => activeLine && onJudge(activeLine.id, "green")}>Green Flag <kbd>G</kbd></button>
            <button type="button" disabled={!isActiveRespondent || Boolean(activeJudgment)} onClick={() => activeLine && onJudge(activeLine.id, "red")}>Red Flag <kbd>R</kbd></button>
          </>
        ) : (
          <button type="button" disabled={!isActiveRespondent || activeLineIsFlagged} onClick={() => activeLine && onFlag(activeLine.id)}>Flag current line <kbd>F</kbd></button>
        )}
      </div>
      <div ref={transcriptRef} className={styles.transcriptViewport} onScroll={updateFollowMode} aria-live="polite" aria-label={isPitch ? "Live founder pitch transcript" : "Live reference call transcript"}>
        <div className={styles.transcriptLines}>
          {visibleLines.map((line, index) => {
            const isActive = index === activeLineIndex;
            const isRespondent = line.speaker === (isPitch ? "Founder" : "Reference");
            const isFlagged = flaggedLineIds.includes(line.id);
            const judgment = pitchJudgments[line.id];
            const canAct = isActive && isRespondent && !isFlagged && !judgment;
            return (
              <article key={line.id} className={styles.transcriptLine} data-active={isActive || undefined} data-reference={isRespondent || undefined} data-flagged={(isFlagged || Boolean(judgment)) || undefined} data-judgment={judgment}>
                <div className={styles.lineMeta}><span>{line.speaker}</span>{isFlagged ? <span className={styles.flaggedLabel}>Flagged</span> : null}{judgment ? <span className={`${styles.flaggedLabel} ${judgment === "green" ? styles.greenFlaggedLabel : styles.redFlaggedLabel}`}>{judgment === "green" ? "Green Flagged" : "Red Flagged"}</span> : null}</div>
                {canAct && !isPitch ? (
                  <button type="button" className={styles.flagButton} onClick={() => onFlag(line.id)} aria-label={`Flag Reference line: ${line.text}`}>
                    {line.text}<span className={styles.flagPrompt}>Flag this line</span>
                  </button>
                ) : <p className={styles.lineText}>{line.text}</p>}
                {canAct && isPitch ? <div className={styles.judgmentActions}><button type="button" onClick={() => onJudge(line.id, "green")}>Green Flag</button><button type="button" onClick={() => onJudge(line.id, "red")}>Red Flag</button></div> : null}
              </article>
            );
          })}
        </div>
      </div>
      <div className={styles.liveAdvanceHelper} aria-label="Automatic transcript timing">
        <p>
          <strong>Messages advance automatically.</strong>
          <span>The transcript follows the live line while you stay near the bottom.</span>
        </p>
        <button
          type="button"
          className={styles.nextMessageButton}
          onClick={onAdvance}
          aria-label="Move to the next message early"
        >
          Ready early? Next message
          <span>
            <kbd>N</kbd>
            <span className={styles.shortcutSeparator} aria-hidden="true">/</span>
            <kbd>→</kbd>
          </span>
        </button>
      </div>
    </section>
  );
}
