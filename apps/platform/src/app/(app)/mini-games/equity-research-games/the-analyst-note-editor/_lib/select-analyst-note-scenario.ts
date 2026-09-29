import {
  selectUnseenItem,
  updateSeenItemIds,
} from "@/app/(app)/mini-games/vc-games/_lib/select-unseen-item";

import type { AnalystNoteScenario } from "./analyst-note-types";

function validSeenIds(
  scenarios: readonly AnalystNoteScenario[],
  seenScenarioIds: readonly string[],
): string[] {
  const currentIds = new Set(scenarios.map((scenario) => scenario.id));
  return [...new Set(seenScenarioIds)].filter((id) => currentIds.has(id));
}

export function selectAnalystNoteScenario(
  scenarios: readonly AnalystNoteScenario[],
  seenScenarioIds: readonly string[],
): AnalystNoteScenario {
  return selectUnseenItem(
    scenarios,
    validSeenIds(scenarios, seenScenarioIds),
    "The Analyst Note Editor needs at least one scenario.",
  );
}

export function markAnalystNoteScenarioSeen(
  scenarios: readonly AnalystNoteScenario[],
  seenScenarioIds: readonly string[],
  completedScenarioId: string,
): string[] {
  return updateSeenItemIds(
    validSeenIds(scenarios, seenScenarioIds),
    completedScenarioId,
    scenarios.length,
  );
}
