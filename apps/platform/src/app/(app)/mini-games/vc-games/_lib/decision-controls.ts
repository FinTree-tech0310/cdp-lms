export type VcDecision = "fund" | "pass" | "maybe";

export type DecisionTone = "orange" | "ink" | "indigo";

export interface DecisionOption<Choice extends string = string> {
  choice: Choice;
  label: string;
  shortcuts?: readonly string[];
  tone?: DecisionTone;
}

export interface VcDecisionOption extends DecisionOption<VcDecision> {
  shortcuts: readonly [string, string];
}

export const VC_DECISIONS: readonly VcDecisionOption[] = [
  { choice: "maybe", label: "Maybe", shortcuts: ["←", "A"] },
  { choice: "pass", label: "Pass", shortcuts: ["↑", "W"] },
  { choice: "fund", label: "Fund", shortcuts: ["→", "D"] },
];

const KEY_TO_DECISION: Readonly<Record<string, VcDecision>> = {
  arrowright: "fund",
  d: "fund",
  arrowup: "pass",
  w: "pass",
  arrowleft: "maybe",
  a: "maybe",
};

export function getVcDecisionFromKey(key: string): VcDecision | undefined {
  return KEY_TO_DECISION[key.toLowerCase()];
}
