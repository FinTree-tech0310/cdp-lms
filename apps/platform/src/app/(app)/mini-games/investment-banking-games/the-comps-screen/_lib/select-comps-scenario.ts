import {
  selectUnseenItem,
  updateSeenItemIds,
} from "@/app/(app)/mini-games/vc-games/_lib/select-unseen-item";

import type { CompsScenario } from "../_data/comps-scenarios";

export function selectCompsScenario(
  scenarios: readonly CompsScenario[],
  seenScenarioIds: readonly string[],
) {
  const currentIds = new Set(scenarios.map((scenario) => scenario.id));
  const validSeenIds = [...new Set(seenScenarioIds)].filter((id) => currentIds.has(id));

  return selectUnseenItem(
    scenarios,
    validSeenIds,
    "The Comps Screen needs at least one scenario.",
  );
}

export function markCompsScenarioSeen(
  scenarios: readonly CompsScenario[],
  seenScenarioIds: readonly string[],
  completedScenarioId: string,
) {
  const currentIds = new Set(scenarios.map((scenario) => scenario.id));
  const validSeenIds = [...new Set(seenScenarioIds)].filter((id) => currentIds.has(id));

  return updateSeenItemIds(
    validSeenIds,
    completedScenarioId,
    scenarios.length,
  );
}
