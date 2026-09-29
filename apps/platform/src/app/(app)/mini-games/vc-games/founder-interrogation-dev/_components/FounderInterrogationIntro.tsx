"use client";

import Image from "next/image";

import { VcPrimaryButton } from "../../_components/VcPrimaryButton";
import { useEntryEnterShortcut } from "../../_lib/use-entry-enter-shortcut";
import styles from "../founder-interrogation.module.css";

interface FounderInterrogationIntroProps {
  onStart: () => void;
}

export function FounderInterrogationIntro({ onStart }: FounderInterrogationIntroProps) {
  useEntryEnterShortcut(true, onStart);

  return (
    <section className={styles.introPanel} aria-labelledby="founder-interrogation-title">
      <div className={styles.introMotif} aria-hidden="true">
        <Image
          src="/images/vc-games/founder-interrogation.png"
          alt=""
          fill
          sizes="220px"
          priority
        />
      </div>
      <div className={styles.introContent}>
        <p className={styles.eyebrow}>Pitch judgment</p>
        <h1 id="founder-interrogation-title">Watch the founder. Make the call.</h1>
        <p className={styles.introCopy}>
          You are the VC. Watch an anonymous re-presentation of a real startup idea, then
          accept or reject the pitch before the company is revealed.
        </p>
        <p className={styles.introMechanics}>
          Anonymous pitch <span aria-hidden="true">·</span> Your decision{" "}
          <span aria-hidden="true">·</span> Real-company reveal
        </p>
        <VcPrimaryButton beam spacing="roomy" onClick={onStart}>
          Browse Pitches
        </VcPrimaryButton>
      </div>
    </section>
  );
}
