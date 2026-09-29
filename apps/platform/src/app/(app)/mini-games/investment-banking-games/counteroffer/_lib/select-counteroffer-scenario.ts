import {
  selectUnseenItem,
  updateSeenItemIds,
} from "../../../vc-games/_lib/select-unseen-item";

import type { CounterofferScenario } from "./counteroffer-types";

function validSeenIds(
  scenarios: readonly CounterofferScenario[],
  seenScenarioIds: readonly string[],
) {
  const currentIds = new Set(scenarios.map((scenario) => scenario.id));
  return [...new Set(seenScenarioIds)].filter((id) => currentIds.has(id));
}

export function selectCounterofferScenario(
  scenarios: readonly CounterofferScenario[],
  seenScenarioIds: readonly string[],
) {
  return selectUnseenItem(
    scenarios,
    validSeenIds(scenarios, seenScenarioIds),
    "Counteroffer needs at least one scenario.",
  );
}

export function markCounterofferScenarioSeen(
  scenarios: readonly CounterofferScenario[],
  seenScenarioIds: readonly string[],
  completedScenarioId: string,
) {
  return updateSeenItemIds(
    validSeenIds(scenarios, seenScenarioIds),
    completedScenarioId,
    scenarios.length,
  );
}
