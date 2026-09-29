import { ClientAvatar } from "../../client-dossier/_components/ClientAvatar";
import type { PanicCallScenario } from "../_data/panic-call-scenarios";
import type { PanicCallPath } from "../_lib/panic-call-state";
import styles from "../panic-call.module.css";

interface IncomingCallProps {
  scenario: PanicCallScenario;
  presentation: "feminine" | "masculine";
  avatarStats: readonly string[];
  isConnecting: boolean;
  onAnswer: () => void;
  onDecline: (path: Extract<PanicCallPath, "decline">) => void;
}

export function IncomingCall({
  scenario,
  presentation,
  avatarStats,
  isConnecting,
  onAnswer,
  onDecline,
}: IncomingCallProps) {
  return (
    <section
      className={`${styles.incomingPanel} ${isConnecting ? styles.incomingConnecting : ""}`}
      aria-labelledby="incoming-call-title"
    >
      <p className={styles.callStatus}>Incoming call</p>
      <div className={styles.ringingPortrait}>
        <span className={styles.ring} aria-hidden="true" />
        <span className={styles.ring} aria-hidden="true" />
        <div className={styles.incomingAvatar}>
          <ClientAvatar
            seed={scenario.clientAvatarSeed}
            presentation={presentation}
            stats={avatarStats}
          />
        </div>
      </div>
      <h1 id="incoming-call-title">{scenario.clientName}</h1>
      <p className={styles.incomingPrompt}>
        {isConnecting ? "Connecting…" : "A client is trying to reach you."}
      </p>
      <div className={styles.callActions} aria-label="Incoming call actions">
        <button
          type="button"
          className={styles.callAction}
          disabled={isConnecting}
          onClick={onAnswer}
        >
          <span>Answer</span>
          <kbd aria-label="Shortcut A">A</kbd>
        </button>
        <button
          type="button"
          className={styles.callAction}
          disabled={isConnecting}
          onClick={() => onDecline("decline")}
        >
          <span>Decline</span>
          <kbd aria-label="Shortcut D">D</kbd>
        </button>
      </div>
    </section>
  );
}
