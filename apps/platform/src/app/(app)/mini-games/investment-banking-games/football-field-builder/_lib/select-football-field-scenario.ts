import {
  selectUnseenItem,
  updateSeenItemIds,
} from "../../../vc-games/_lib/select-unseen-item";

import type { FootballFieldScenario } from "./football-field-types";

function validSeenIds(scenarios: readonly FootballFieldScenario[], seenIds: readonly string[]) {
  const ids = new Set(scenarios.map((scenario) => scenario.id));
  return [...new Set(seenIds)].filter((id) => ids.has(id));
}

export function selectFootballFieldScenario(
  scenarios: readonly FootballFieldScenario[],
  seenIds: readonly string[],
) {
  return selectUnseenItem(
    scenarios,
    validSeenIds(scenarios, seenIds),
    "Football Field Builder needs at least one scenario.",
  );
}

export function markFootballFieldScenarioSeen(
  scenarios: readonly FootballFieldScenario[],
  seenIds: readonly string[],
  completedScenarioId: string,
) {
  return updateSeenItemIds(
    validSeenIds(scenarios, seenIds),
    completedScenarioId,
    scenarios.length,
  );
}
