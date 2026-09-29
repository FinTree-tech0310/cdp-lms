import type {
  ChartScenario,
  EarningsOutcome,
} from "./read-the-chart-types";

export const READ_THE_CHART_STORAGE_KEY =
  "cdp:equity-research-games:read-the-chart:v1";
export const READ_THE_CHART_STORAGE_VERSION = 1;

export interface ReadTheChartPersistence {
  version: typeof READ_THE_CHART_STORAGE_VERSION;
  seenScenarioIds: string[];
}

export interface ReadTheChartResultSnapshot {
  readonly scenarioId: string;
  readonly selectedOutcome: EarningsOutcome;
  readonly correctOutcome: EarningsOutcome;
  readonly matched: boolean;
}

export interface ReadTheChartState {
  phase: "ready" | "reading" | "result";
  activeScenario: ChartScenario | null;
  selectedOutcome: EarningsOutcome | null;
  resultSnapshot: ReadTheChartResultSnapshot | null;
  seenScenarioIds: string[];
  sessionKey: number;
}

export const INITIAL_READ_THE_CHART_STATE: ReadTheChartState = {
  phase: "ready",
  activeScenario: null,
  selectedOutcome: null,
  resultSnapshot: null,
  seenScenarioIds: [],
  sessionKey: 0,
};

export type ReadTheChartAction =
  | { type: "HYDRATE"; payload: ReadTheChartPersistence }
  | { type: "START"; scenario: ChartScenario }
  | { type: "SELECT_OUTCOME"; outcome: EarningsOutcome }
  | { type: "SUBMIT"; seenScenarioIds: string[] };

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function parseReadTheChartPersistence(
  value: unknown,
): ReadTheChartPersistence | null {
  if (!value || typeof value !== "object") return null;

  const candidate = value as Record<string, unknown>;
  if (
    candidate.version !== READ_THE_CHART_STORAGE_VERSION
    || !isStringArray(candidate.seenScenarioIds)
  ) {
    return null;
  }

  return {
    version: READ_THE_CHART_STORAGE_VERSION,
    seenScenarioIds: [...new Set(candidate.seenScenarioIds)],
  };
}

export function readTheChartReducer(
  state: ReadTheChartState,
  action: ReadTheChartAction,
): ReadTheChartState {
  switch (action.type) {
    case "HYDRATE":
      if (state.phase !== "ready") return state;
      return { ...state, seenScenarioIds: [...action.payload.seenScenarioIds] };

    case "START":
      return {
        ...state,
        phase: "reading",
        activeScenario: action.scenario,
        selectedOutcome: null,
        resultSnapshot: null,
        sessionKey: state.sessionKey + 1,
      };

    case "SELECT_OUTCOME":
      if (state.phase !== "reading") return state;
      return { ...state, selectedOutcome: action.outcome };

    case "SUBMIT": {
      if (
        state.phase !== "reading"
        || !state.activeScenario
        || !state.selectedOutcome
      ) {
        return state;
      }

      const resultSnapshot = Object.freeze({
        scenarioId: state.activeScenario.id,
        selectedOutcome: state.selectedOutcome,
        correctOutcome: state.activeScenario.correctOutcome,
        matched:
          state.selectedOutcome === state.activeScenario.correctOutcome,
      });

      return {
        ...state,
        phase: "result",
        resultSnapshot,
        seenScenarioIds: [...action.seenScenarioIds],
      };
    }

    default:
      return state;
  }
}
