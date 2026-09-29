import { assumptionStatus, assumptionValues, normalizeAssumptionValue, orderedAssumptions } from "./assumption-values";
import { computeModelOutputs } from "./compute-model-outputs";
import type { AssumptionId, AssumptionValues, ModelOutputs, ModelUpdateResultSnapshot, ModelUpdateScenario } from "./model-update-types";

export const MODEL_UPDATE_STORAGE_KEY = "cdp:equity-research-games:model-update-reflex:v1";
export interface ModelUpdatePersistence { version: 1; seenScenarioIds: string[] }
export interface ModelUpdateState {
  phase: "ready" | "updating" | "result";
  activeScenario: ModelUpdateScenario | null;
  currentValues: Readonly<AssumptionValues> | null;
  originalOutputs: ModelOutputs | null;
  resultSnapshot: ModelUpdateResultSnapshot | null;
  seenScenarioIds: string[];
  sessionKey: number;
}
export const INITIAL_MODEL_UPDATE_STATE: ModelUpdateState = {
  phase: "ready", activeScenario: null, currentValues: null, originalOutputs: null,
  resultSnapshot: null, seenScenarioIds: [], sessionKey: 0,
};
type Action =
  | { type: "HYDRATE"; payload: ModelUpdatePersistence }
  | { type: "START"; scenario: ModelUpdateScenario }
  | { type: "UPDATE_ASSUMPTION"; id: AssumptionId; value: number }
  | { type: "SUBMIT"; seenScenarioIds: string[] };

export function parseModelUpdatePersistence(value: unknown): ModelUpdatePersistence | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Record<string, unknown>;
  if (candidate.version !== 1 || !Array.isArray(candidate.seenScenarioIds)
    || !candidate.seenScenarioIds.every((id) => typeof id === "string")) return null;
  return { version: 1, seenScenarioIds: [...new Set(candidate.seenScenarioIds as string[])] };
}

export function createModelUpdateSnapshot(
  scenario: ModelUpdateScenario,
  values: Readonly<AssumptionValues>,
  originalOutputs: ModelOutputs,
): ModelUpdateResultSnapshot {
  return Object.freeze({
    scenarioId: scenario.id,
    submittedValues: Object.freeze({ ...values }),
    assumptionReviews: Object.freeze(orderedAssumptions(scenario.assumptions).map((driver) => Object.freeze({
      id: driver.id, label: driver.label, unit: driver.unit, min: driver.min, step: driver.step,
      startingValue: driver.startingValue, submittedValue: values[driver.id],
      referenceValue: driver.referenceValue, toleranceAmount: driver.toleranceAmount,
      status: assumptionStatus(values[driver.id], driver.referenceValue, driver.toleranceAmount),
      reasoning: driver.reasoning,
    }))),
    originalOutputs: Object.freeze({ ...originalOutputs }),
    learnerOutputs: Object.freeze(computeModelOutputs(scenario.priorPeriodActuals, values)),
    referenceOutputs: Object.freeze(computeModelOutputs(scenario.priorPeriodActuals, assumptionValues(scenario.assumptions, "referenceValue"))),
    financialUnit: scenario.financialUnit, resultSummary: scenario.resultSummary,
  });
}

export function modelUpdateReducer(state: ModelUpdateState, action: Action): ModelUpdateState {
  switch (action.type) {
    case "HYDRATE":
      return state.phase === "ready" ? { ...state, seenScenarioIds: [...action.payload.seenScenarioIds] } : state;
    case "START": {
      const currentValues = Object.freeze(assumptionValues(action.scenario.assumptions, "startingValue"));
      return {
        ...state, phase: "updating", activeScenario: action.scenario, currentValues,
        originalOutputs: Object.freeze(computeModelOutputs(action.scenario.priorPeriodActuals, currentValues)),
        resultSnapshot: null, sessionKey: state.sessionKey + 1,
      };
    }
    case "UPDATE_ASSUMPTION": {
      if (state.phase !== "updating" || !state.currentValues || !Number.isFinite(action.value)) return state;
      const driver = state.activeScenario?.assumptions.find((item) => item.id === action.id);
      if (!driver) return state;
      const value = normalizeAssumptionValue(driver, action.value);
      if (value === state.currentValues[action.id]) return state;
      return { ...state, currentValues: Object.freeze({ ...state.currentValues, [action.id]: value }) };
    }
    case "SUBMIT":
      if (state.phase !== "updating" || !state.activeScenario || !state.currentValues || !state.originalOutputs) return state;
      return {
        ...state, phase: "result",
        resultSnapshot: createModelUpdateSnapshot(state.activeScenario, state.currentValues, state.originalOutputs),
        seenScenarioIds: [...action.seenScenarioIds],
      };
    default: return state;
  }
}
