import { selectUnseenItem } from "@/app/(app)/mini-games/vc-games/_lib/select-unseen-item";

import type { FraudTriageScenarioSet } from "./fraud-triage-types";

export function validSeenScenarioIds(
  scenarios: readonly FraudTriageScenarioSet[],
  seenIds: readonly string[],
): string[] {
  const validIds = new Set(scenarios.map(({ id }) => id));
  return [...new Set(seenIds)].filter((id) => validIds.has(id));
}

export function selectTriageScenario(
  scenarios: readonly FraudTriageScenarioSet[],
  seenIds: readonly string[],
): FraudTriageScenarioSet {
  return selectUnseenItem(
    scenarios,
    validSeenScenarioIds(scenarios, seenIds),
    "Fraud Signal Triage requires a scenario set.",
  );
}
