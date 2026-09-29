import { BorderBeam } from "@/components/ui/border-beam";

import type { CompsScenario } from "../_data/comps-scenarios";
import type { FinalCandidatePlacement } from "../_lib/comps-screen-state";
import styles from "../the-comps-screen.module.css";

interface CompsScreenReviewProps {
  scenario: CompsScenario;
  candidateOrder: readonly string[];
  finalPlacements: Record<string, FinalCandidatePlacement>;
  onTryAnother: () => void;
}

const PLACEMENT_LABELS: Record<FinalCandidatePlacement, string> = {
  include: "Include",
  exclude: "Exclude",
};

export function CompsScreenReview({
  scenario,
  candidateOrder,
  finalPlacements,
  onTryAnother,
}: CompsScreenReviewProps) {
  const candidateById = new Map(
    scenario.candidates.map((candidate) => [candidate.id, candidate]),
  );

  return (
    <section className={styles.reviewSection} aria-labelledby="screen-review-title">
      <div className={styles.reviewHeading}>
        <div>
          <p className={styles.eyebrow}>Analyst review</p>
          <h2 id="screen-review-title">Review the full comp screen.</h2>
        </div>
        <p>
          Compare every placement with the authored screening mandate and review the reasoning behind it.
        </p>
      </div>

      <div className={styles.reviewGrid}>
        {candidateOrder.map((candidateId) => {
          const candidate = candidateById.get(candidateId);
          const placement = finalPlacements[candidateId];
          if (!candidate || !placement) return null;

          const expectedPlacement = candidate.shouldInclude ? "include" : "exclude";
          const matched = placement === expectedPlacement;

          return (
            <article
              key={candidate.id}
              className={styles.reviewCard}
              data-review={matched ? "matched" : "needs-look"}
            >
              <div className={styles.reviewCompanyHeading}>
                <h3>{candidate.name}</h3>
                <span>{matched ? "Matched the Screen" : "Needs Another Look"}</span>
              </div>
              <dl className={styles.reviewPlacement}>
                <div>
                  <dt>You placed</dt>
                  <dd>{PLACEMENT_LABELS[placement]}</dd>
                </div>
                <div>
                  <dt>Screen review</dt>
                  <dd>{matched ? "Matched the Screen" : "Needs Another Look"}</dd>
                </div>
              </dl>
              <div className={styles.reviewReasoning}>
                <p className={styles.reasoningLabel}>Analyst reasoning</p>
                <p>{candidate.reasoning}</p>
              </div>
            </article>
          );
        })}
      </div>

      <button type="button" className={styles.primaryButton} onClick={onTryAnother}>
        <BorderBeam lightWidth={74} duration={4.2} borderWidth={2} />
        <span>Try Another</span>
      </button>
    </section>
  );
}
