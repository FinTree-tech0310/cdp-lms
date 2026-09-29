import { VcPrimaryButton } from "@/app/(app)/mini-games/vc-games/_components/VcPrimaryButton";

import { ClientAvatar } from "../../client-dossier/_components/ClientAvatar";
import type { ClientTimelineScenario } from "../_data/client-timeline-scenarios";
import type { TimelineChoice } from "../_lib/client-timeline-state";
import { ClientTimelineRail } from "./ClientTimelineRail";
import styles from "../client-timeline.module.css";

interface TimelineEndingProps {
  scenario: ClientTimelineScenario;
  choices: readonly TimelineChoice[];
  endingSummary: string;
  presentation: "feminine" | "masculine";
  onTryAnother: () => void;
}

export function TimelineEnding({
  scenario,
  choices,
  endingSummary,
  presentation,
  onTryAnother,
}: TimelineEndingProps) {
  const choicesByStop = new Map(choices.map((choice) => [choice.stopId, choice]));

  return (
    <section className={styles.endingPanel} aria-labelledby="timeline-ending-title" data-ending-panel>
      <header className={styles.endingHeader} data-ending-detail>
        <div className={styles.endingAvatar}>
          <ClientAvatar seed={scenario.clientAvatarSeed} presentation={presentation} />
        </div>
        <div>
          <p className={styles.sectionEyebrow}>Your advisory pattern</p>
          <h1 id="timeline-ending-title" tabIndex={-1}>{scenario.clientName}</h1>
          <p>Three moments. Three decisions. One client relationship over time.</p>
        </div>
      </header>

      <div data-ending-detail>
        <ClientTimelineRail stops={scenario.stops} currentIndex={2} mode="complete" />
      </div>

      <div className={styles.decisionHistory} data-ending-detail>
        {scenario.stops.map((stop) => (
          <article key={stop.id}>
            <span>{stop.yearMarker}</span>
            <h2>{stop.stopLabel}</h2>
            <p>{choicesByStop.get(stop.id)?.optionLabel}</p>
          </article>
        ))}
      </div>

      <article className={styles.endingSummary} data-ending-detail>
        <p>What your decisions reveal</p>
        <div>{endingSummary}</div>
      </article>

      <div className={styles.endingAction} data-ending-detail>
        <VcPrimaryButton beam spacing="roomy" onClick={onTryAnother}>
          Try Another
        </VcPrimaryButton>
      </div>
    </section>
  );
}
