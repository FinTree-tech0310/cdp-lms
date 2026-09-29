import {
  selectUnseenItem,
  updateSeenItemIds,
} from "@/app/(app)/mini-games/vc-games/_lib/select-unseen-item";

import type { ClientTimelineScenario } from "../_data/client-timeline-scenarios";

export function selectClientTimelineScenario(
  scenarios: readonly ClientTimelineScenario[],
  seenScenarioIds: readonly string[],
): ClientTimelineScenario {
  const availableIds = new Set(scenarios.map((scenario) => scenario.id));
  const validSeenIds = [
    ...new Set(seenScenarioIds.filter((id) => availableIds.has(id))),
  ];
  return selectUnseenItem(
    scenarios,
    validSeenIds,
    "Client Timeline needs at least one scenario.",
  );
}

export function completeClientTimelineScenario(
  seenScenarioIds: readonly string[],
  scenarioId: string,
  scenarioCount: number,
): string[] {
  return updateSeenItemIds(seenScenarioIds, scenarioId, scenarioCount);
}
