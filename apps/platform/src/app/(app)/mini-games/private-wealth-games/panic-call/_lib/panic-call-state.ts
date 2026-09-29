import type { PanicCallScenario } from "../_data/panic-call-scenarios";

export const PANIC_CALL_STORAGE_KEY =
  "cdp:private-wealth-games:panic-call:v1";
export const PANIC_CALL_STORAGE_VERSION = 1;

export type PanicCallPath =
  | "decline"
  | "hold-and-reassure"
  | "partial-rebalance"
  | "execute-sell";

export type PanicCallPhase =
  | "ready"
  | "incoming"
  | "connecting"
  | "connected"
  | "resolving"
  | "outcome"
  | "comparison";

export interface PanicCallPersistence {
  version: typeof PANIC_CALL_STORAGE_VERSION;
  seenScenarioIds: string[];
}

export interface PanicCallState {
  phase: PanicCallPhase;
  activeScenario: PanicCallScenario | null;
  selectedPath: PanicCallPath | null;
  seenScenarioIds: string[];
  sessionKey: number;
}

export type PanicCallAction =
  | { type: "HYDRATE"; payload: PanicCallPersistence }
  | { type: "START"; scenario: PanicCallScenario }
  | { type: "ANSWER" }
  | { type: "CONNECT" }
  | {
      type: "SELECT_PATH";
      path: PanicCallPath;
      seenScenarioIds: string[];
    }
  | { type: "SHOW_OUTCOME" }
  | { type: "SHOW_OTHER_PATHS" };

export const INITIAL_PANIC_CALL_STATE: PanicCallState = {
  phase: "ready",
  activeScenario: null,
  selectedPath: null,
  seenScenarioIds: [],
  sessionKey: 0,
};

export function parsePanicCallPersistence(
  value: unknown,
): PanicCallPersistence | null {
  if (!value || typeof value !== "object") return null;

  const candidate = value as Partial<PanicCallPersistence>;
  if (
    candidate.version !== PANIC_CALL_STORAGE_VERSION
    || !Array.isArray(candidate.seenScenarioIds)
    || !candidate.seenScenarioIds.every((id) => typeof id === "string")
  ) {
    return null;
  }

  return {
    version: PANIC_CALL_STORAGE_VERSION,
    seenScenarioIds: [...new Set(candidate.seenScenarioIds)],
  };
}

export function panicCallReducer(
  state: PanicCallState,
  action: PanicCallAction,
): PanicCallState {
  switch (action.type) {
    case "HYDRATE":
      if (state.phase !== "ready") return state;
      return { ...state, seenScenarioIds: action.payload.seenScenarioIds };
    case "START":
      return {
        ...state,
        phase: "incoming",
        activeScenario: action.scenario,
        selectedPath: null,
        sessionKey: state.sessionKey + 1,
      };
    case "ANSWER":
      if (state.phase !== "incoming") return state;
      return { ...state, phase: "connecting" };
    case "CONNECT":
      if (state.phase !== "connecting") return state;
      return { ...state, phase: "connected" };
    case "SELECT_PATH":
      if (state.phase !== "incoming" && state.phase !== "connected") {
        return state;
      }
      return {
        ...state,
        phase: "resolving",
        selectedPath: action.path,
        seenScenarioIds: action.seenScenarioIds,
      };
    case "SHOW_OUTCOME":
      if (state.phase !== "resolving") return state;
      return { ...state, phase: "outcome" };
    case "SHOW_OTHER_PATHS":
      if (state.phase !== "outcome") return state;
      return { ...state, phase: "comparison" };
    default:
      return state;
  }
}
