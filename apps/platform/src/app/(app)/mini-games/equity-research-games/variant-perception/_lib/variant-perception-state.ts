import { isVariantOptionId } from "./variant-options";
import type { VariantOptionId, VariantPerceptionScenario, VariantResultSnapshot } from "./variant-perception-types";
export const VARIANT_STORAGE_KEY = "cdp:equity-research-games:variant-perception:v1";
export interface VariantPersistence { version: 1; seenScenarioIds: string[] }
export interface VariantState {
  phase: "ready" | "choosing" | "result";
  activeScenario: VariantPerceptionScenario | null;
  optionDisplayOrder: readonly VariantOptionId[];
  selectedOptionId: VariantOptionId | null;
  resultSnapshot: VariantResultSnapshot | null;
  showOtherPaths: boolean;
  seenScenarioIds: string[];
  sessionKey: number;
}
export const INITIAL_VARIANT_STATE: VariantState = {
  phase: "ready", activeScenario: null, optionDisplayOrder: [], selectedOptionId: null,
  resultSnapshot: null, showOtherPaths: false, seenScenarioIds: [], sessionKey: 0,
};
type Action =
  | { type: "HYDRATE"; payload: VariantPersistence }
  | { type: "START"; scenario: VariantPerceptionScenario; order: readonly VariantOptionId[] }
  | { type: "SELECT"; id: VariantOptionId }
  | { type: "SUBMIT"; seenScenarioIds: string[] }
  | { type: "REVEAL_OTHER_PATHS" };
export function parseVariantPersistence(value: unknown): VariantPersistence | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Record<string, unknown>;
  if (candidate.version !== 1 || !Array.isArray(candidate.seenScenarioIds) || !candidate.seenScenarioIds.every(id => typeof id === "string")) return null;
  return { version: 1, seenScenarioIds: [...new Set(candidate.seenScenarioIds as string[])] };
}
export function createVariantSnapshot(scenario: VariantPerceptionScenario, selected: VariantOptionId, order: readonly VariantOptionId[]): VariantResultSnapshot {
  const chosen = scenario.options.find(option => option.optionId === selected);
  if (!chosen) throw new Error("Variant Perception: selected outcome is missing.");
  return Object.freeze({
    scenarioId: scenario.id, selectedOptionId: selected,
    optionDisplayOrder: Object.freeze([...order]), selectedOutcome: chosen.outcome,
    alternativeOutcomes: Object.freeze(order.filter(id => id !== selected).map(id => {
      const option = scenario.options.find(option => option.optionId === id);
      if (!option) throw new Error(`Variant Perception: outcome ${id} is missing.`);
      return Object.freeze({ ...option });
    })),
  });
}
export function variantReducer(state: VariantState, action: Action): VariantState {
  switch (action.type) {
    case "HYDRATE": return state.phase === "ready" ? { ...state, seenScenarioIds: [...action.payload.seenScenarioIds] } : state;
    case "START":
      if (action.order.length !== 3 || new Set(action.order).size !== 3 || !action.order.every(isVariantOptionId)) throw new Error("Variant Perception: invalid display order.");
      return { ...state, phase: "choosing", activeScenario: action.scenario, optionDisplayOrder: Object.freeze([...action.order]), selectedOptionId: null, resultSnapshot: null, showOtherPaths: false, sessionKey: state.sessionKey + 1 };
    case "SELECT": return state.phase === "choosing" && isVariantOptionId(action.id) ? { ...state, selectedOptionId: action.id } : state;
    case "SUBMIT":
      if (state.phase !== "choosing" || !state.activeScenario || !state.selectedOptionId) return state;
      return { ...state, phase: "result", resultSnapshot: createVariantSnapshot(state.activeScenario, state.selectedOptionId, state.optionDisplayOrder), seenScenarioIds: [...action.seenScenarioIds] };
    case "REVEAL_OTHER_PATHS": return state.phase === "result" && !state.showOtherPaths ? { ...state, showOtherPaths: true } : state;
    default: return state;
  }
}
