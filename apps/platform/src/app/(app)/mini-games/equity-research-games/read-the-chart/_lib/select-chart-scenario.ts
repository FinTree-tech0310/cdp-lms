import {
  selectUnseenItem,
  updateSeenItemIds,
} from "@/app/(app)/mini-games/vc-games/_lib/select-unseen-item";

import type { ChartScenario } from "./read-the-chart-types";

function validSeenIds(
  scenarios: readonly ChartScenario[],
  seenScenarioIds: readonly string[],
): string[] {
  const currentIds = new Set(scenarios.map((scenario) => scenario.id));
  return [...new Set(seenScenarioIds)].filter((id) => currentIds.has(id));
}

export function selectChartScenario(
  scenarios: readonly ChartScenario[],
  seenScenarioIds: readonly string[],
): ChartScenario {
  return selectUnseenItem(
    scenarios,
    validSeenIds(scenarios, seenScenarioIds),
    "Read the Chart needs at least one scenario.",
  );
}

export function markChartScenarioSeen(
  scenarios: readonly ChartScenario[],
  seenScenarioIds: readonly string[],
  completedScenarioId: string,
): string[] {
  return updateSeenItemIds(
    validSeenIds(scenarios, seenScenarioIds),
    completedScenarioId,
    scenarios.length,
  );
}
