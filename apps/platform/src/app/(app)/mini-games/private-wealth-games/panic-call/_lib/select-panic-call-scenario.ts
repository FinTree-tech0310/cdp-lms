import {
  selectUnseenItem,
  updateSeenItemIds,
} from "@/app/(app)/mini-games/vc-games/_lib/select-unseen-item";

import type { PanicCallScenario } from "../_data/panic-call-scenarios";

export function selectPanicCallScenario(
  scenarios: readonly PanicCallScenario[],
  seenScenarioIds: readonly string[],
): PanicCallScenario {
  const availableIds = new Set(scenarios.map((scenario) => scenario.id));
  const validSeenIds = [
    ...new Set(seenScenarioIds.filter((id) => availableIds.has(id))),
  ];

  return selectUnseenItem(
    scenarios,
    validSeenIds,
    "Panic Call needs at least one scenario.",
  );
}

export function completePanicCallScenario(
  seenScenarioIds: readonly string[],
  scenarioId: string,
  scenarioCount: number,
): string[] {
  return updateSeenItemIds(seenScenarioIds, scenarioId, scenarioCount);
}
