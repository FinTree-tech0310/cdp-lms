import { selectUnseenItem, updateSeenItemIds } from "@/app/(app)/mini-games/vc-games/_lib/select-unseen-item";
import type { VariantPerceptionScenario } from "./variant-perception-types";
function validSeen(scenarios: readonly VariantPerceptionScenario[], seen: readonly string[]) {
  const ids = new Set(scenarios.map(scenario => scenario.id));
  return [...new Set(seen)].filter(id => ids.has(id));
}
export function selectVariantScenario(scenarios: readonly VariantPerceptionScenario[], seen: readonly string[]) {
  return selectUnseenItem(scenarios, validSeen(scenarios, seen), "Variant Perception requires a scenario.");
}
export function markVariantScenarioSeen(scenarios: readonly VariantPerceptionScenario[], seen: readonly string[], id: string) {
  return updateSeenItemIds(validSeen(scenarios, seen), id, scenarios.length);
}
