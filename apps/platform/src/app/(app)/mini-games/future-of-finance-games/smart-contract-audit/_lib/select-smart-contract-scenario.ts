import { selectUnseenItem } from "@/app/(app)/mini-games/vc-games/_lib/select-unseen-item";

import type { SmartContractScenario } from "./smart-contract-types";

export function validSmartContractSeenIds(
  scenarios: readonly SmartContractScenario[],
  seenIds: readonly string[],
): string[] {
  const validIds = new Set(scenarios.map(({ id }) => id));
  return [...new Set(seenIds)].filter((id) => validIds.has(id));
}

export function selectSmartContractScenario(
  scenarios: readonly SmartContractScenario[],
  seenIds: readonly string[],
): SmartContractScenario {
  return selectUnseenItem(
    scenarios,
    validSmartContractSeenIds(scenarios, seenIds),
    "Smart Contract Audit requires a scenario.",
  );
}
