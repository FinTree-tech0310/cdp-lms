import {
  selectUnseenItem,
  updateSeenItemIds,
} from "@/app/(app)/mini-games/vc-games/_lib/select-unseen-item";

import type { RebalanceScenario } from "../_data/rebalance-scenarios";

export interface RebalanceScenarioSelection {
  scenario: RebalanceScenario;
  seenScenarioIds: string[];
}

export function selectRebalanceScenario(
  scenarios: readonly RebalanceScenario[],
  seenScenarioIds: readonly string[],
): RebalanceScenarioSelection {
  const availableIds = new Set(scenarios.map((scenario) => scenario.id));
  const validSeenIds = [
    ...new Set(seenScenarioIds.filter((id) => availableIds.has(id))),
  ];
  const scenario = selectUnseenItem(
    scenarios,
    validSeenIds,
    "Rebalance the Drift needs at least one scenario.",
  );
  return {
    scenario,
    seenScenarioIds: updateSeenItemIds(
      validSeenIds,
      scenario.id,
      scenarios.length,
    ),
  };
}
