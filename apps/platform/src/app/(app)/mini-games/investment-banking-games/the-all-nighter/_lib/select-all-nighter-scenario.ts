import { selectUnseenItem, updateSeenItemIds } from "../../../vc-games/_lib/select-unseen-item";
import type { AllNighterScenario } from "./all-nighter-types";
const valid = (scenarios: readonly AllNighterScenario[], seen: readonly string[]) => { const ids = new Set(scenarios.map((item) => item.id)); return [...new Set(seen)].filter((id) => ids.has(id)); };
export const selectAllNighterScenario = (scenarios: readonly AllNighterScenario[], seen: readonly string[]) => selectUnseenItem(scenarios, valid(scenarios, seen), "The All-Nighter needs at least one scenario.");
export const markAllNighterScenarioSeen = (scenarios: readonly AllNighterScenario[], seen: readonly string[], id: string) => updateSeenItemIds(valid(scenarios, seen), id, scenarios.length);
