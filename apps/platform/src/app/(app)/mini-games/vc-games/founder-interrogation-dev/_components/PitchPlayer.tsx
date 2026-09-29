"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { forwardRef, useEffect, useRef } from "react";

import type { FounderPitchVideo } from "../_data/founder-pitch-videos";
import type { FounderDecision } from "../_lib/founder-interrogation-state";
import styles from "../founder-interrogation.module.css";

gsap.registerPlugin(useGSAP);

interface PitchPlayerProps {
  pitch: FounderPitchVideo;
  pitchLabel: string;
  isDecisionReady: boolean;
  onDecisionReady: () => void;
  onDecide: (decision: FounderDecision) => void;
}

const END_SEEK_TOLERANCE_SECONDS = 0.05;

export const PitchPlayer = forwardRef<HTMLHeadingElement, PitchPlayerProps>(function PitchPlayer(
  { pitch, pitchLabel, isDecisionReady, onDecisionReady, onDecide },
  decisionHeadingRef,
) {
  const stageRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => () => videoRef.current?.pause(), []);

  useGSAP(
    () => {
      if (!stageRef.current) return;

      const parts = gsap.utils.toArray<HTMLElement>("[data-player-part]", stageRef.current);
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reducedMotion) {
        gsap.set(parts, { autoAlpha: 1, y: 0, scale: 1 });
        return;
      }

      gsap
        .timeline({ defaults: { ease: "power2.out" } })
        .fromTo(
          "[data-player-part='header']",
          { autoAlpha: 0, y: 7 },
          { autoAlpha: 1, y: 0, duration: 0.24 },
        )
        .fromTo(
          "[data-player-part='disclaimer']",
          { autoAlpha: 0, y: 5 },
          { autoAlpha: 1, y: 0, duration: 0.22 },
          "-=0.11",
        )
        .fromTo(
          "[data-player-part='video']",
          { autoAlpha: 0, y: 9, scale: 0.994 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.3 },
          "-=0.1",
        )
        .fromTo(
          "[data-player-part='early-decision']",
          { autoAlpha: 0, y: 5 },
          { autoAlpha: 1, y: 0, duration: 0.2 },
          "-=0.12",
        );
    },
    { dependencies: [pitch.id], scope: stageRef, revertOnUpdate: true },
  );

  useGSAP(
    () => {
      if (!isDecisionReady || !stageRef.current) return;

      const decisionParts = gsap.utils.toArray<HTMLElement>(
        "[data-decision-part]",
        stageRef.current,
      );
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reducedMotion) {
        gsap.set(decisionParts, { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        decisionParts,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.24, stagger: 0.045, ease: "power2.out" },
      );
    },
    { dependencies: [isDecisionReady], scope: stageRef, revertOnUpdate: true },
  );

  const finishPitch = () => {
    videoRef.current?.pause();
    onDecisionReady();
  };

  const handleSeeked = () => {
    const video = videoRef.current;
    if (
      video &&
      Number.isFinite(video.duration) &&
      video.duration > 0 &&
      video.currentTime >= video.duration - END_SEEK_TOLERANCE_SECONDS
    ) {
      finishPitch();
    }
  };

  return (
    <section ref={stageRef} className={styles.playerStage} aria-labelledby="anonymous-pitch-title">
      <header className={styles.playerHeader} data-player-part="header">
        <div>
          <p className={styles.eyebrow}>Founder Interrogation</p>
          <h1 id="anonymous-pitch-title">{pitchLabel}</h1>
        </div>
        <span>Identity hidden</span>
      </header>

      <p className={styles.disclaimer} data-player-part="disclaimer">
        <strong>
          This is an original re-presentation of a real startup&apos;s idea, performed by our team —
          not the original founder.
        </strong>
      </p>

      <div className={styles.videoFrame} data-player-part="video">
        <video
          key={pitch.id}
          ref={videoRef}
          className={styles.video}
          src={pitch.videoUrl}
          poster={pitch.thumbnailUrl}
          autoPlay
          controls
          preload="metadata"
          aria-label="Anonymous startup pitch video"
          onEnded={finishPitch}
          onSeeked={handleSeeked}
        >
          Your browser does not support HTML5 video playback.
        </video>
      </div>

      {!isDecisionReady ? (
        <div className={styles.endPitchArea} data-player-part="early-decision">
          <p>Watch as much as you need. Pausing does not end the pitch.</p>
          <button type="button" className={styles.endPitchButton} onClick={finishPitch}>
            End Pitch &amp; Decide
          </button>
        </div>
      ) : (
        <div className={styles.decisionPanel}>
          <p className={styles.eyebrow} data-decision-part>Your investment call</p>
          <h2 ref={decisionHeadingRef} tabIndex={-1} data-decision-part>You&apos;ve heard enough. What do you do?</h2>
          <div className={styles.decisionButtons} data-decision-part>
            <button type="button" onClick={() => onDecide("accept")}>Accept</button>
            <button type="button" onClick={() => onDecide("reject")}>Reject</button>
          </div>
        </div>
      )}
    </section>
  );
});
