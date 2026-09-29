import {
  createNeutralRanges,
  updateRangeEndpoint,
} from "./football-field-geometry";
import type {
  FootballFieldScenario,
  LearnerRanges,
  MethodologyId,
  SubmittedFootballFieldSnapshot,
} from "./football-field-types";

export const FOOTBALL_FIELD_STORAGE_KEY =
  "cdp:investment-banking-games:football-field-builder:v1";
export const FOOTBALL_FIELD_STORAGE_VERSION = 1;

export interface FootballFieldPersistence {
  version: typeof FOOTBALL_FIELD_STORAGE_VERSION;
  seenScenarioIds: string[];
}

export interface FootballFieldState {
  phase: "ready" | "building" | "results";
  activeScenario: FootballFieldScenario | null;
  ranges: LearnerRanges | null;
  submittedSnapshot: SubmittedFootballFieldSnapshot | null;
  seenScenarioIds: string[];
}

export const INITIAL_FOOTBALL_FIELD_STATE: FootballFieldState = {
  phase: "ready",
  activeScenario: null,
  ranges: null,
  submittedSnapshot: null,
  seenScenarioIds: [],
};

export type FootballFieldAction =
  | { type: "HYDRATE"; payload: FootballFieldPersistence }
  | { type: "START"; scenario: FootballFieldScenario }
  | { type: "UPDATE_ENDPOINT"; methodologyId: MethodologyId; endpoint: "low" | "high"; value: number }
  | { type: "SUBMIT"; snapshot: SubmittedFootballFieldSnapshot; seenScenarioIds: string[] };

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function parseFootballFieldPersistence(value: unknown): FootballFieldPersistence | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Record<string, unknown>;
  if (
    candidate.version !== FOOTBALL_FIELD_STORAGE_VERSION
    || !isStringArray(candidate.seenScenarioIds)
    || new Set(candidate.seenScenarioIds).size !== candidate.seenScenarioIds.length
  ) return null;
  return { version: FOOTBALL_FIELD_STORAGE_VERSION, seenScenarioIds: [...candidate.seenScenarioIds] };
}

export function footballFieldReducer(state: FootballFieldState, action: FootballFieldAction): FootballFieldState {
  switch (action.type) {
    case "HYDRATE":
      return state.phase === "ready" ? { ...state, seenScenarioIds: [...action.payload.seenScenarioIds] } : state;
    case "START":
      return {
        ...state,
        phase: "building",
        activeScenario: action.scenario,
        ranges: createNeutralRanges(action.scenario),
        submittedSnapshot: null,
      };
    case "UPDATE_ENDPOINT":
      if (state.phase !== "building" || !state.activeScenario || !state.ranges) return state;
      return {
        ...state,
        ranges: updateRangeEndpoint(
          state.ranges,
          action.methodologyId,
          action.endpoint,
          action.value,
          state.activeScenario,
        ),
      };
    case "SUBMIT":
      if (state.phase !== "building") return state;
      return {
        ...state,
        phase: "results",
        submittedSnapshot: action.snapshot,
        seenScenarioIds: [...action.seenScenarioIds],
      };
    default:
      return state;
  }
}
