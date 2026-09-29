import { BriefcaseBusiness, MessageSquareText, Target } from "lucide-react";

import styles from "../counteroffer.module.css";

interface DealContextPanelProps {
  dealContext: string;
  sellerStrongTermsNote: string;
  buyerContextNote?: string;
}

export function DealContextPanel({
  dealContext,
  sellerStrongTermsNote,
  buyerContextNote,
}: DealContextPanelProps) {
  return (
    <aside className={styles.contextRail} aria-label="Deal reference">
      <section className={styles.contextCard}>
        <div className={styles.panelHeading}>
          <BriefcaseBusiness aria-hidden="true" />
          <div>
            <p>Deal file</p>
            <h2>Deal Context</h2>
          </div>
        </div>
        <p className={styles.contextText}>{dealContext}</p>
      </section>
      <section className={styles.sellerPriorities}>
        <div className={styles.panelHeading}>
          <Target aria-hidden="true" />
          <div>
            <p>Your mandate</p>
            <h2>Seller Priorities</h2>
          </div>
        </div>
        <p>{sellerStrongTermsNote}</p>
      </section>
      {buyerContextNote ? (
        <section className={styles.buyerNote}>
          <div className={styles.panelHeading}>
            <MessageSquareText aria-hidden="true" />
            <div>
              <p>Incoming</p>
              <h2>Buyer Message</h2>
            </div>
          </div>
          <p>{buyerContextNote}</p>
        </section>
      ) : null}
    </aside>
  );
}
