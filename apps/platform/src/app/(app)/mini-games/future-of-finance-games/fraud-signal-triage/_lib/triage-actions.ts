import type { TriageAction } from "./fraud-triage-types";

export const TRIAGE_ACTIONS = ["approve", "stepUpVerify", "blockEscalate"] as const;

export const TRIAGE_ACTION_LABELS: Record<TriageAction, string> = {
  approve: "Approve",
  stepUpVerify: "Step-Up Verify",
  blockEscalate: "Block & Escalate",
};

export function isTriageAction(value: unknown): value is TriageAction {
  return TRIAGE_ACTIONS.some((action) => action === value);
}
