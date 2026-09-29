import type { PushBackRequest } from "../_data/push-back-sets";
import type { PushBackDecision } from "../_lib/push-back-state";
import styles from "../would-you-push-back.module.css";

interface PushBackReviewProps {
  requests: readonly PushBackRequest[];
  responses: Readonly<Record<string, PushBackDecision>>;
}

function decisionLabel(decision: PushBackDecision): string {
  if (decision === "advise-against") return "Advise Against";
  if (decision === "follow") return "Follow Their Lead";
  if (decision === "compromise") return "Find a Compromise";
  return "Skipped";
}

export function PushBackReview({ requests, responses }: PushBackReviewProps) {
  return (
    <div className={styles.reviewList}>
      {requests.map((request) => {
        const decision = responses[request.id] ?? "skipped";

        return (
          <article key={request.id} className={styles.reviewCard}>
            <p className={styles.reviewLabel}>Client message</p>
            <p className={styles.reviewClientName}>{request.clientName}</p>
            <div className={styles.reviewMessage}>“{request.message}”</div>

            <div className={styles.reviewDecision}>
              <span>You chose</span>
              <strong>{decisionLabel(decision)}</strong>
            </div>

            <div className={styles.advisorPerspective}>
              <p>Advisor perspective</p>
              <span>{request.guidanceNote}</span>
            </div>
          </article>
        );
      })}
    </div>
  );
}
