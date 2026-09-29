import { CountdownBar } from "@/app/(app)/mini-games/vc-games/_components/CountdownBar";

import { ClientAvatar } from "../../client-dossier/_components/ClientAvatar";
import type { PushBackRequest } from "../_data/push-back-sets";
import type { PushBackDecision } from "../_lib/push-back-state";
import { PushBackDecisionControls } from "./PushBackDecisionControls";
import styles from "../would-you-push-back.module.css";

const SPEECH_RATE_OPTIONS = [0.9, 1, 1.2, 1.4] as const;

function avatarPresentationFromSeed(
  seed: string,
): "feminine" | "masculine" {
  let hash = 0;

  for (const character of seed) {
    hash = Math.imul(hash, 31) + character.charCodeAt(0);
  }

  return (hash >>> 0) % 2 === 0 ? "feminine" : "masculine";
}

interface IncomingClientRequestProps {
  request: PushBackRequest;
  currentNumber: number;
  totalRequests: number;
  sessionKey: number;
  decisionTimeMs: number;
  isPresenting: boolean;
  resolvingDecision: PushBackDecision | null;
  isTtsSupported: boolean;
  isTtsEnabled: boolean;
  isSpeaking: boolean;
  speechRate: number;
  onToggleTts: () => void;
  onSpeechRateChange: (speechRate: number) => void;
  onChoose: (decision: Exclude<PushBackDecision, "skipped">) => void;
}

export function IncomingClientRequest({
  request,
  currentNumber,
  totalRequests,
  sessionKey,
  decisionTimeMs,
  isPresenting,
  resolvingDecision,
  isTtsSupported,
  isTtsEnabled,
  isSpeaking,
  speechRate,
  onToggleTts,
  onSpeechRateChange,
  onChoose,
}: IncomingClientRequestProps) {
  const selectedDecision =
    resolvingDecision && resolvingDecision !== "skipped"
      ? resolvingDecision
      : null;
  const isResolving = resolvingDecision !== null;
  const requestKey = [sessionKey, request.id].join(":");

  return (
    <section className={styles.playPanel} aria-labelledby="incoming-request-title">
      <div className={styles.roundMeta}>
        <p>
          Request <strong>{currentNumber}</strong> / {totalRequests}
        </p>
        <p>{decisionTimeMs / 1_000}-second response window</p>
      </div>

      <article
        key={requestKey}
        className={[
          styles.messagingWorkspace,
          isResolving ? styles.workspaceResolving : "",
        ].join(" ")}
      >
        <header className={styles.contactHeader}>
          <div className={styles.contactIdentity}>
            <div className={styles.contactAvatar}>
              <ClientAvatar
                seed={request.clientAvatarSeed}
                presentation={avatarPresentationFromSeed(
                  request.clientAvatarSeed,
                )}
              />
              <span className={styles.statusDot} aria-hidden="true" />
            </div>
            <div className={styles.contactCopy}>
              <h1 id="incoming-request-title">{request.clientName}</h1>
              <p>Client · Incoming message</p>
            </div>
          </div>
          <span className={styles.messageStatus}>Now</span>
        </header>

        <div className={styles.timerDock}>
          <CountdownBar
            durationMs={decisionTimeMs}
            restartKey={requestKey}
            stopped={isPresenting || isResolving}
            label={`${decisionTimeMs / 1_000}-second decision timer`}
            emphasizeReset
          />
        </div>

        <div className={styles.messageLane}>
          <div className={styles.messageBubble}>
            <p>{request.message}</p>
          </div>

          <div className={styles.voiceControls}>
            <button
              type="button"
              className={styles.ttsButton}
              onClick={onToggleTts}
              disabled={!isTtsSupported || isPresenting}
              aria-pressed={isTtsEnabled}
              aria-label={
                isTtsSupported
                  ? isTtsEnabled
                    ? "Turn off client message read aloud"
                    : "Read client message aloud"
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
                disabled={!isTtsSupported || isPresenting}
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
      </article>

      <div className={styles.decisionArea}>
        <p className={styles.decisionPrompt}>How would you respond?</p>
        <PushBackDecisionControls
          selectedDecision={selectedDecision}
          disabled={isPresenting || isResolving}
          onChoose={onChoose}
        />
      </div>

      <p className={styles.feedback} aria-live="polite">
        {resolvingDecision === "advise-against" ? "Advise Against recorded." : null}
        {resolvingDecision === "follow" ? "Follow Their Lead recorded." : null}
        {resolvingDecision === "compromise" ? "Find a Compromise recorded." : null}
        {resolvingDecision === "skipped" ? "Time expired — recorded as skipped." : null}
        {resolvingDecision === null ? "\u00A0" : null}
      </p>
    </section>
  );
}
