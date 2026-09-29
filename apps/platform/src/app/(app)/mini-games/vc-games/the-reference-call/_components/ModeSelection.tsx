"use client";

import { useEffect, useRef } from "react";

import { VcPrimaryButton } from "../../_components/VcPrimaryButton";
import type { FounderPitchTranscript } from "../_data/founder-pitch-transcripts";
import type { ReferenceCallTranscript } from "../_data/reference-call-transcripts";
import styles from "../the-reference-call.module.css";

interface ModeSelectionProps {
  reference: ReferenceCallTranscript;
  pitch: FounderPitchTranscript;
  onStartReference: () => void;
  onStartPitch: () => void;
}

export function ModeSelection({ reference, pitch, onStartReference, onStartPitch }: ModeSelectionProps) {
  const selectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    selectionRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }, []);

  return (
    <section ref={selectionRef} className={styles.modeSelection} aria-labelledby="listen-mode-title">
      <div className={styles.modeSelectionHeading}>
        <p className={styles.eyebrow}>The Reference Call</p>
        <h1 id="listen-mode-title">Choose what you want to listen to.</h1>
      </div>
      <div className={styles.modeCards}>
        <article className={styles.modeCard} data-mode="reference">
          <p className={styles.modeCardLabel}>Reference Call</p>
          <h2>Diligencing {reference.founderName}</h2>
          <div className={styles.modeContext}><span>Your reference</span><p>{reference.referenceContext}</p></div>
          <div className={styles.modeContext}><span>What you&apos;re checking</span><p>{reference.diligenceFocus}</p></div>
          <p className={styles.modeInstruction}>Listen for what isn&apos;t being said. Flag evasive answers, contradictions, and carefully worded warnings.</p>
          <VcPrimaryButton beam spacing="roomy" onClick={onStartReference}>Start Call</VcPrimaryButton>
        </article>
        <article className={styles.modeCard} data-mode="pitch">
          <p className={styles.modeCardLabel}>Founder Pitch</p>
          <h2>{pitch.founderName}</h2>
          <div className={styles.modeContext}><span>The company</span><p>{pitch.startupContext}</p></div>
          <div className={styles.modeContext}><span>What you&apos;re checking</span><p>{pitch.diligenceFocus}</p></div>
          <p className={styles.modeInstruction}>Listen to the founder directly. Mark meaningful statements as Green or Red; let neutral lines pass.</p>
          <VcPrimaryButton beam spacing="roomy" onClick={onStartPitch}>Start Pitch</VcPrimaryButton>
        </article>
      </div>
    </section>
  );
}
