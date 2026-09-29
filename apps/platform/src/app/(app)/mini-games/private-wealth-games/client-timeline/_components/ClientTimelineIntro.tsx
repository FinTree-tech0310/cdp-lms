import { VcPrimaryButton } from "@/app/(app)/mini-games/vc-games/_components/VcPrimaryButton";

import { ClientAvatar } from "../../client-dossier/_components/ClientAvatar";
import type { ClientTimelineScenario } from "../_data/client-timeline-scenarios";
import { ClientTimelineRail } from "./ClientTimelineRail";
import styles from "../client-timeline.module.css";

interface ClientTimelineIntroProps {
  scenario: ClientTimelineScenario;
  presentation: "feminine" | "masculine";
  onBegin: () => void;
}

export function ClientTimelineIntro({
  scenario,
  presentation,
  onBegin,
}: ClientTimelineIntroProps) {
  return (
    <section className={styles.clientIntroPanel} aria-labelledby="timeline-client-title">
      <div className={styles.introIdentity}>
        <div className={styles.introAvatar}>
          <ClientAvatar seed={scenario.clientAvatarSeed} presentation={presentation} />
        </div>
        <div>
          <p className={styles.sectionEyebrow}>One client · Three moments</p>
          <h1 id="timeline-client-title">{scenario.clientName}</h1>
          <p className={styles.clientIntroText}>{scenario.introText}</p>
        </div>
      </div>
      <div className={styles.timelinePreview}>
        <p>Follow this client through time</p>
        <ClientTimelineRail stops={scenario.stops} currentIndex={0} mode="preview" />
      </div>
      <div className={styles.introAction}>
        <VcPrimaryButton beam spacing="roomy" onClick={onBegin}>
          Begin Timeline
        </VcPrimaryButton>
      </div>
    </section>
  );
}
