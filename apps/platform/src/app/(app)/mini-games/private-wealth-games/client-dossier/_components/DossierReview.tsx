import type { ClientDossierCard } from "../_data/client-dossiers";
import type { ClientDossierDecision } from "../_lib/client-dossier-state";
import { ClientAvatar } from "./ClientAvatar";
import styles from "../client-dossier.module.css";

interface DossierReviewProps {
  dossiers: readonly ClientDossierCard[];
  responses: Readonly<Record<string, ClientDossierDecision>>;
}

function decisionLabel(decision: ClientDossierDecision): string {
  if (decision === "honor") return "Honor the Request";
  if (decision === "push-back") return "Push Back";
  return "Skipped";
}

export function DossierReview({ dossiers, responses }: DossierReviewProps) {
  return (
    <div className={styles.reviewList}>
      {dossiers.map((dossier) => {
        const decision = responses[dossier.id] ?? "skipped";

        return (
          <article key={dossier.id} className={styles.reviewCard}>
            <header className={styles.reviewHeader}>
              <ClientAvatar
                seed={dossier.avatarSeed}
                stats={dossier.stats}
                presentation={dossier.avatarPresentation}
              />
              <div>
                <p className={styles.reviewName}>{dossier.clientName}</p>
                <ul className={styles.reviewStats} aria-label="Client context">
                  {dossier.stats.map((stat) => (
                    <li key={stat}>{stat}</li>
                  ))}
                </ul>
              </div>
            </header>

            <div className={styles.reviewQuote}>“{dossier.clientQuote}”</div>

            <div className={styles.reviewDecision}>
              <span>You chose</span>
              <strong>{decisionLabel(decision)}</strong>
            </div>

            <div className={styles.advisorPerspective}>
              <p>Advisor perspective</p>
              <span>{dossier.guidanceNote}</span>
            </div>
          </article>
        );
      })}
    </div>
  );
}
