import { ClientAvatar } from "../../client-dossier/_components/ClientAvatar";
import type { PanicCallScenario } from "../_data/panic-call-scenarios";
import type { PanicCallPath } from "../_lib/panic-call-state";
import { PanicCallActions } from "./PanicCallActions";
import styles from "../panic-call.module.css";

const SPEECH_RATES = [0.9, 1, 1.2, 1.4] as const;

interface ConnectedCallProps {
  scenario: PanicCallScenario;
  presentation: "feminine" | "masculine";
  avatarStats: readonly string[];
  isResolving: boolean;
  isTtsSupported: boolean;
  isTtsEnabled: boolean;
  isSpeaking: boolean;
  speechRate: number;
  onToggleTts: () => void;
  onSpeechRateChange: (rate: number) => void;
  onChoose: (path: Exclude<PanicCallPath, "decline">) => void;
}

export function ConnectedCall({
  scenario,
  presentation,
  avatarStats,
  isResolving,
  isTtsSupported,
  isTtsEnabled,
  isSpeaking,
  speechRate,
  onToggleTts,
  onSpeechRateChange,
  onChoose,
}: ConnectedCallProps) {
  return (
    <section
      className={`${styles.connectedPanel} ${isResolving ? styles.connectedResolving : ""}`}
      aria-labelledby="connected-call-title"
    >
      <header className={styles.connectedHeader}>
        <div className={styles.connectedIdentity}>
          <div className={styles.connectedAvatar}>
            <ClientAvatar
              seed={scenario.clientAvatarSeed}
              presentation={presentation}
              stats={avatarStats}
            />
          </div>
          <div>
            <p className={styles.connectedStatus}>
              <span aria-hidden="true" /> Connected
            </p>
            <h1 id="connected-call-title">{scenario.clientName}</h1>
          </div>
        </div>
        <p className={styles.callMode}>Client call</p>
      </header>

      <div className={styles.callWorkspace}>
        <aside className={styles.marketUpdate} aria-label="Market update">
          <p className={styles.sectionEyebrow}>Market update</p>
          <p>{scenario.marketContext}</p>
        </aside>

        <div className={styles.transcriptBlock}>
          <p className={styles.transcriptSpeaker}>Client</p>
          <p className={styles.transcriptMessage}>“{scenario.panicMessage}”</p>
          <div className={styles.voiceControls}>
            <button
              type="button"
              className={styles.ttsButton}
              aria-pressed={isTtsEnabled}
              disabled={!isTtsSupported || isResolving}
              onClick={onToggleTts}
            >
              <span className={styles.voiceBars} aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              {!isTtsSupported
                ? "Read aloud unavailable"
                : isTtsEnabled
                  ? isSpeaking
                    ? "Reading aloud"
                    : "Read aloud on"
                  : "Read aloud"}
            </button>
            <label className={styles.rateControl}>
              <span>Speed</span>
              <select
                value={speechRate}
                disabled={!isTtsSupported || isResolving}
                onChange={(event) => onSpeechRateChange(Number(event.target.value))}
              >
                {SPEECH_RATES.map((rate) => (
                  <option key={rate} value={rate}>{rate.toFixed(1)}×</option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      <PanicCallActions disabled={isResolving} onChoose={onChoose} />
      <p className={styles.choiceNote}>No timer. Consider the trade-off before you respond.</p>
    </section>
  );
}
