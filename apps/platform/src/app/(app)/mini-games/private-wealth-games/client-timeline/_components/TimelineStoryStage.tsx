import { ClientAvatar } from "../../client-dossier/_components/ClientAvatar";
import type {
  TimelineStop,
  TimelineStopOption,
} from "../_data/client-timeline-scenarios";
import type {
  ClientTimelinePhase,
  TimelineChoice,
} from "../_lib/client-timeline-state";
import { TimelineOptionControls } from "./TimelineOptionControls";
import { TimelineTtsControls } from "./TimelineTtsControls";
import styles from "../client-timeline.module.css";

interface TimelineStoryStageProps {
  clientName: string;
  clientAvatarSeed: string;
  presentation: "feminine" | "masculine";
  stop: TimelineStop;
  phase: ClientTimelinePhase;
  orderedOptions: readonly TimelineStopOption[];
  selectedChoice: TimelineChoice | null;
  isTtsSupported: boolean;
  isTtsEnabled: boolean;
  isSpeaking: boolean;
  speechRate: number;
  onToggleTts: () => void;
  onSpeechRateChange: (rate: number) => void;
  onChoose: (option: TimelineStopOption) => void;
  onContinue: () => void;
  isLastStop: boolean;
}

export function TimelineStoryStage({
  clientName,
  clientAvatarSeed,
  presentation,
  stop,
  phase,
  orderedOptions,
  selectedChoice,
  isTtsSupported,
  isTtsEnabled,
  isSpeaking,
  speechRate,
  onToggleTts,
  onSpeechRateChange,
  onChoose,
  onContinue,
  isLastStop,
}: TimelineStoryStageProps) {
  const showingConsequence = phase === "stop-consequence" || phase === "advancing";

  if (showingConsequence && selectedChoice) {
    const selectedOption = stop.options.find(
      (option) => option.id === selectedChoice.optionId,
    );
    if (!selectedOption) return null;
    return (
      <article className={styles.consequencePanel} data-timeline-stage data-timeline-outgoing>
        <p className={styles.sectionEyebrow}>You chose</p>
        <h1 tabIndex={-1}>{selectedChoice.optionLabel}</h1>
        <div className={styles.consequenceStory}>
          <p>What happened next</p>
          <div>{selectedOption.immediateConsequence}</div>
        </div>
        {phase === "stop-consequence" ? (
          <button type="button" className={styles.continueButton} onClick={onContinue}>
            <span>{isLastStop ? "See your advisory pattern" : "Continue through time"}</span>
            <span aria-hidden="true">→</span>
          </button>
        ) : (
          <p className={styles.timePassing} aria-live="polite">Moving forward through time…</p>
        )}
      </article>
    );
  }

  return (
    <article className={styles.storyPanel} data-timeline-stage>
      <header className={styles.storyHeader}>
        <div className={styles.stopIdentity}>
          <div className={styles.stopAvatar}>
            <ClientAvatar seed={clientAvatarSeed} presentation={presentation} />
          </div>
          <div>
            <p>{clientName}</p>
            <span>Client timeline</span>
          </div>
        </div>
        <div className={styles.stopMeta}>
          <small>{stop.yearMarker}</small>
          <strong>{stop.stopLabel}</strong>
        </div>
      </header>
      <div className={styles.storyBeat}>
        <p className={styles.sectionEyebrow}>What changed</p>
        <h1 tabIndex={-1} data-stop-heading>{stop.stopLabel}</h1>
        <p>{stop.storyBeat}</p>
        <TimelineTtsControls
          isSupported={isTtsSupported}
          isEnabled={isTtsEnabled}
          isSpeaking={isSpeaking}
          speechRate={speechRate}
          disabled={phase === "resolving-choice"}
          onToggle={onToggleTts}
          onRateChange={onSpeechRateChange}
        />
      </div>
      <TimelineOptionControls
        options={orderedOptions}
        selectedOptionId={selectedChoice?.optionId ?? null}
        disabled={phase !== "stop-decision"}
        onChoose={onChoose}
      />
    </article>
  );
}
