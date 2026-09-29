import { CountdownBar } from "@/app/(app)/mini-games/vc-games/_components/CountdownBar";
import { DecisionControls } from "@/app/(app)/mini-games/vc-games/_components/DecisionControls";
import type { DecisionOption } from "@/app/(app)/mini-games/vc-games/_lib/decision-controls";

import type { ClientDossierCard } from "../_data/client-dossiers";
import type { ClientDossierDecision } from "../_lib/client-dossier-state";
import { ClientAvatar } from "./ClientAvatar";
import styles from "../client-dossier.module.css";

const DOSSIER_DECISIONS: readonly DecisionOption<
  Exclude<ClientDossierDecision, "skipped">
>[] = [
  {
    choice: "honor",
    label: "Honor the Request",
    shortcuts: ["←", "A"],
    tone: "orange",
  },
  {
    choice: "push-back",
    label: "Push Back",
    shortcuts: ["→", "D"],
    tone: "orange",
  },
];

const SPEECH_RATE_OPTIONS = [0.9, 1, 1.2, 1.4] as const;

interface DossierCardProps {
  dossier: ClientDossierCard;
  currentNumber: number;
  totalDossiers: number;
  sessionKey: number;
  decisionTimeMs: number;
  resolvingDecision: ClientDossierDecision | null;
  isTtsSupported: boolean;
  isTtsEnabled: boolean;
  isSpeaking: boolean;
  speechRate: number;
  onToggleTts: () => void;
  onSpeechRateChange: (speechRate: number) => void;
  onChoose: (decision: Exclude<ClientDossierDecision, "skipped">) => void;
}

export function DossierCard({
  dossier,
  currentNumber,
  totalDossiers,
  sessionKey,
  decisionTimeMs,
  resolvingDecision,
  isTtsSupported,
  isTtsEnabled,
  isSpeaking,
  speechRate,
  onToggleTts,
  onSpeechRateChange,
  onChoose,
}: DossierCardProps) {
  const selectedDecision =
    resolvingDecision === "honor" || resolvingDecision === "push-back"
      ? resolvingDecision
      : null;
  const isResolving = resolvingDecision !== null;
  const dossierKey = [sessionKey, dossier.id].join(":");

  return (
    <section className={styles.playPanel} aria-labelledby="dossier-title">
      <div className={styles.roundMeta}>
        <p>
          Dossier <strong>{currentNumber}</strong> / {totalDossiers}
        </p>
        <p>{decisionTimeMs / 1_000}-second response window</p>
      </div>

      <CountdownBar
        durationMs={decisionTimeMs}
        restartKey={dossierKey}
        stopped={isResolving}
        label={`${decisionTimeMs / 1_000}-second decision timer`}
        emphasizeReset
      />

      <article
        key={dossierKey}
        className={[
          styles.dossierCard,
          isResolving ? styles.dossierResolving : "",
        ].join(" ")}
      >
        <header className={styles.dossierHeader}>
          <h1 id="dossier-title">{dossier.clientName}</h1>
        </header>

        <ul className={styles.statList} aria-label="Client context">
          {dossier.stats.map((stat) => (
            <li key={stat}>{stat}</li>
          ))}
        </ul>

        <div className={styles.clientVoice}>
          <div className={styles.portraitStage}>
            <ClientAvatar
              seed={dossier.avatarSeed}
              stats={dossier.stats}
              presentation={dossier.avatarPresentation}
            />
            <span className={styles.portraitLabel}>Client profile</span>
          </div>
          <div className={styles.quoteCluster}>
            <div className={styles.quoteBubble}>
              <span className={styles.decorativeQuote} aria-hidden="true">“</span>
              <p className={styles.quoteLabel}>Client says</p>
              <p>“{dossier.clientQuote}”</p>
            </div>
            <div className={styles.voiceControls}>
              <button
                type="button"
                className={styles.ttsButton}
                onClick={onToggleTts}
                disabled={!isTtsSupported}
                aria-pressed={isTtsEnabled}
                aria-label={
                  isTtsSupported
                    ? isTtsEnabled
                      ? "Turn off client quote read aloud"
                      : "Read client quote aloud"
                    : "Read aloud is unavailable in this browser"
                }
              >
                <span
                  className={[
                    styles.voiceIndicator,
                    isSpeaking ? styles.voiceIndicatorActive : "",
                  ].join(" ")}
                  aria-hidden="true"
                >
                  <span />
                  <span />
                  <span />
                </span>
                {isTtsSupported
                  ? isTtsEnabled
                    ? isSpeaking
                      ? "Reading"
                      : "Voice on"
                    : "Read aloud"
                  : "Voice unavailable"}
              </button>
              <label className={styles.speechRateControl}>
                <span>Speed</span>
                <select
                  value={speechRate}
                  onChange={(event) =>
                    onSpeechRateChange(Number(event.currentTarget.value))
                  }
                  disabled={!isTtsSupported}
                  aria-label="Read aloud speed"
                >
                  {SPEECH_RATE_OPTIONS.map((rate) => (
                    <option key={rate} value={rate}>
                      {rate.toFixed(1)}×{rate === 1.2 ? " default" : ""}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>
      </article>

      <div
        className={[
          styles.decisionArea,
          isResolving ? styles.decisionLocked : "",
        ].join(" ")}
        aria-disabled={isResolving}
      >
        <p className={styles.decisionPrompt}>How would you respond?</p>
        <DecisionControls
          selectedChoice={selectedDecision}
          onChoose={onChoose}
          decisions={DOSSIER_DECISIONS}
          ariaLabel="Choose how to respond to this client request"
          variant="rapid"
        />
      </div>

      <p className={styles.feedback} aria-live="polite">
        {resolvingDecision === "honor" ? "Honor the Request recorded." : null}
        {resolvingDecision === "push-back" ? "Push Back recorded." : null}
        {resolvingDecision === "skipped" ? "Time expired — recorded as skipped." : null}
        {resolvingDecision === null ? "\u00A0" : null}
      </p>
    </section>
  );
}
