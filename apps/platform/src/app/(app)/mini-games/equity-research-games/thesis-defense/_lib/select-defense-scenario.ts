import {
  selectUnseenItem,
  updateSeenItemIds,
} from "@/app/(app)/mini-games/vc-games/_lib/select-unseen-item";

import type { ThesisDefenseScenario } from "./thesis-defense-types";

function validSeenIds(
  scenarios: readonly ThesisDefenseScenario[],
  seenScenarioIds: readonly string[],
): string[] {
  const currentIds = new Set(scenarios.map((scenario) => scenario.id));
  return [...new Set(seenScenarioIds)].filter((id) => currentIds.has(id));
}

export function selectDefenseScenario(
  scenarios: readonly ThesisDefenseScenario[],
  seenScenarioIds: readonly string[],
): ThesisDefenseScenario {
  return selectUnseenItem(
    scenarios,
    validSeenIds(scenarios, seenScenarioIds),
    "Thesis Defense needs at least one scenario.",
  );
}

export function markDefenseScenarioSeen(
  scenarios: readonly ThesisDefenseScenario[],
  seenScenarioIds: readonly string[],
  completedScenarioId: string,
): string[] {
  return updateSeenItemIds(
    validSeenIds(scenarios, seenScenarioIds),
    completedScenarioId,
    scenarios.length,
  );
}
