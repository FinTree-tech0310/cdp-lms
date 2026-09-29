import { ArrowLeft, DoorOpen } from "lucide-react";

import styles from "../bidding-war.module.css";

export function WalkAwayConfirmation({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <section className={styles.walkConfirmation} aria-labelledby="walk-heading">
      <div><p className={styles.eyebrow}>Strategic exit</p><h3 id="walk-heading">Walk away from this auction?</h3></div>
      <p>You still have authorization to continue bidding. Walking away ends this deal process now.</p>
      <div className={styles.editorActions}>
        <button type="button" className={styles.secondaryButton} onClick={onCancel}>
          <ArrowLeft aria-hidden="true" /> Keep Bidding
        </button>
        <button type="button" className={styles.walkButton} onClick={onConfirm}>
          <DoorOpen aria-hidden="true" /> Walk Away
        </button>
      </div>
    </section>
  );
}
