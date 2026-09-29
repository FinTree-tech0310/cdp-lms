import { selectUnseenItem, updateSeenItemIds } from "@/app/(app)/mini-games/vc-games/_lib/select-unseen-item";
import type { ModelUpdateScenario } from "./model-update-types";

function validSeenIds(scenarios: readonly ModelUpdateScenario[], seen: readonly string[]) {
  const ids = new Set(scenarios.map((scenario) => scenario.id));
  return [...new Set(seen)].filter((id) => ids.has(id));
}
export function selectModelUpdateScenario(scenarios: readonly ModelUpdateScenario[], seen: readonly string[]) {
  return selectUnseenItem(scenarios, validSeenIds(scenarios, seen), "Model Update Reflex needs at least one scenario.");
}
export function markModelUpdateScenarioSeen(scenarios: readonly ModelUpdateScenario[], seen: readonly string[], id: string) {
  return updateSeenItemIds(validSeenIds(scenarios, seen), id, scenarios.length);
}
