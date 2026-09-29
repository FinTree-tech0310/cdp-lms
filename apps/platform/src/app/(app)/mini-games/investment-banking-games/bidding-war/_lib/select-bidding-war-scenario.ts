import {
  selectUnseenItem,
  updateSeenItemIds,
} from "../../../vc-games/_lib/select-unseen-item";

import type { BiddingWarScenario } from "./bidding-war-types";

function validSeenIds(
  scenarios: readonly BiddingWarScenario[],
  seenScenarioIds: readonly string[],
) {
  const currentIds = new Set(scenarios.map((scenario) => scenario.id));
  return [...new Set(seenScenarioIds)].filter((id) => currentIds.has(id));
}

export function selectBiddingWarScenario(
  scenarios: readonly BiddingWarScenario[],
  seenScenarioIds: readonly string[],
) {
  return selectUnseenItem(
    scenarios,
    validSeenIds(scenarios, seenScenarioIds),
    "Bidding War needs at least one scenario.",
  );
}

export function markBiddingWarScenarioSeen(
  scenarios: readonly BiddingWarScenario[],
  seenScenarioIds: readonly string[],
  completedScenarioId: string,
) {
  return updateSeenItemIds(
    validSeenIds(scenarios, seenScenarioIds),
    completedScenarioId,
    scenarios.length,
  );
}
