"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "../the-all-nighter.module.css";

const STEPS = [
  [
    "THE CLOCK KEEPS RUNNING",
    "You have a fixed amount of time for the whole shift. When this clock reaches zero, the session ends — even if work is still waiting.",
  ],
  [
    "THE QUEUE KEEPS GROWING",
    "New requests arrive throughout the session. You won't see everything at the start, and new work can appear while you're already handling something else.",
  ],
  [
    "DEADLINE ≠ WORK TIME",
    "A task may have a 'Start within' countdown and an estimated work time. The countdown tells you how long you have to START it. Work time tells you how long you'll be busy once you commit.",
  ],
  [
    "YOU CAN ONLY HANDLE ONE THING",
    "Starting a task commits you until its work time finishes. While you're busy, other requests still arrive and their deadlines keep moving.",
  ],
  [
    "PRIORITIZE, DON'T CLEAR THE INBOX",
    "Your goal isn't to finish every task. Decide what matters most, what can wait, and what you're willing to let go.",
  ],
] as const;

export function AllNighterGuide({
  step,
  manual,
  onStep,
  onSkip,
  onFinish,
  onDismiss,
}: {
  step: number;
  manual: boolean;
  onStep: (nextStep: number) => void;
  onSkip: () => void;
  onFinish: () => void;
  onDismiss: () => void;
}) {
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    heading.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onDismiss();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [step, onDismiss]);

  const [title, body] = STEPS[step];

  return createPortal(
    <div className={styles.guideLayer}>
      <div className={styles.guideDimmer} />
      <aside className={styles.guideCoachmark} role="dialog" aria-modal="true" aria-labelledby="an-guide-title">
        <p>{step + 1} of 5</p>
        <h2 id="an-guide-title" ref={heading} tabIndex={-1}>
          {title}
        </h2>
        <p>{body}</p>
        {step === 2 ? <p>Some tasks have no hard deadline.</p> : null}
        {step === 3 ? <p>You can&apos;t handle everything — deciding what deserves your time is the game.</p> : null}
        {step === 4 ? <p>At the end you&apos;ll review what you Handled, Missed, and Left Unhandled — with context on why each task mattered.</p> : null}
        <footer>
          <button type="button" onClick={onSkip}>
            Skip guide
          </button>
          <span>
            {step > 0 ? (
              <button type="button" onClick={() => onStep(step - 1)}>
                Back
              </button>
            ) : null}
            {step < 4 ? (
              <button type="button" onClick={() => onStep(step + 1)}>
                Next
              </button>
            ) : (
              <button type="button" onClick={onFinish}>
                {manual ? "Done" : "Begin the shift"}
              </button>
            )}
          </span>
        </footer>
      </aside>
    </div>,
    document.body,
  );
}
