import { Send } from "lucide-react";

import type {
  LeverId,
  LeverValues,
  NegotiationLever,
} from "../_lib/counteroffer-types";
import { GovernanceControl } from "./GovernanceControl";
import { NegotiationLeverControl } from "./NegotiationLeverControl";
import styles from "../counteroffer.module.css";

interface NegotiationWorkspaceProps {
  roundNumber: 1 | 2 | 3;
  levers: readonly NegotiationLever[];
  values: LeverValues;
  disabled: boolean;
  onChange: (leverId: LeverId, value: number) => void;
  onSubmit: () => void;
}

export function NegotiationWorkspace({
  roundNumber,
  levers,
  values,
  disabled,
  onChange,
  onSubmit,
}: NegotiationWorkspaceProps) {
  const governance = levers.find((lever) => lever.id === "governance");
  const sliders = levers.filter((lever) => lever.id !== "governance");
  if (!governance) return null;

  return (
    <section
      className={styles.workspace}
      data-submitted={disabled ? "true" : "false"}
      aria-labelledby="offer-heading"
    >
      <header className={styles.workspaceHeader}>
        <div>
          <p className={styles.eyebrow}>Seller&apos;s proposed package</p>
          <h2 id="offer-heading">Set the Round {roundNumber} terms</h2>
        </div>
        <span className={styles.draftBadge}>{disabled ? "Submitted" : "Working draft"}</span>
      </header>
      <div className={styles.leverGrid}>
        {sliders.map((lever) => (
          <NegotiationLeverControl
            key={lever.id}
            lever={lever}
            value={values[lever.id]}
            disabled={disabled}
            onChange={(value) => onChange(lever.id, value)}
          />
        ))}
      </div>
      <GovernanceControl
        label={governance.label}
        value={values.governance}
        disabled={disabled}
        options={governance.options ?? []}
        onChange={(value) => onChange("governance", value)}
      />
      {!disabled ? (
        <div className={styles.submitRow}>
          <p>Submitting locks this round. You can revise the package in the next round.</p>
          <button type="button" className={styles.primaryButton} onClick={onSubmit}>
            <span>Submit Counteroffer</span>
            <Send aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </section>
  );
}
