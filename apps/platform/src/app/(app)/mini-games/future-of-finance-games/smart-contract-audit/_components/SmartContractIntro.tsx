import type { Ref } from "react";

import { SmartContractIllustration } from "./SmartContractIllustration";
import styles from "../smart-contract-audit.module.css";

interface SmartContractIntroProps {
  ready: boolean;
  startRef: Ref<HTMLButtonElement>;
  onStart: () => void;
}

export function SmartContractIntro({ ready, startRef, onStart }: SmartContractIntroProps) {
  return (
    <section className={styles.intro} aria-labelledby="smart-contract-intro-title">
      <div className={styles.introArt}>
        <SmartContractIllustration />
      </div>
      <div className={styles.introCopy}>
        <p className={styles.eyebrow}>Future of Finance · Technical risk</p>
        <h1 id="smart-contract-intro-title">Smart Contract Audit.</h1>
        <p className={styles.introDescription}>
          Read simplified pseudocode. First identify the vulnerable line, then classify the issue.
        </p>
        <div className={styles.introBrief}>
          <p>Part 1: Select a line and confirm it.</p>
          <p>Part 2: Choose the vulnerability type.</p>
          <p>The two decisions are reviewed separately after submission.</p>
        </div>
        <button ref={startRef} className={styles.primaryButton} type="button" disabled={!ready} onClick={onStart}>
          Start Audit
        </button>
      </div>
    </section>
  );
}
