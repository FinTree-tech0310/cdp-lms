import type {
  CounterofferScenario,
  FinalEndingType,
  LeverId,
  LeverValues,
  SubmittedRoundSnapshot,
} from "./counteroffer-types";

export const COUNTEROFFER_STORAGE_KEY =
  "cdp:investment-banking-games:counteroffer:v1";
export const COUNTEROFFER_STORAGE_VERSION = 1;

export interface CounterofferPersistence {
  version: typeof COUNTEROFFER_STORAGE_VERSION;
  seenScenarioIds: string[];
}

export interface CounterofferState {
  phase: "ready" | "negotiating" | "buyer-response" | "ending";
  activeScenario: CounterofferScenario | null;
  currentRoundNumber: 1 | 2 | 3;
  editableValues: LeverValues | null;
  roundHistory: readonly SubmittedRoundSnapshot[];
  finalEndingType: FinalEndingType | null;
  seenScenarioIds: string[];
  sessionKey: number;
}

export const INITIAL_COUNTEROFFER_STATE: CounterofferState = {
  phase: "ready",
  activeScenario: null,
  currentRoundNumber: 1,
  editableValues: null,
  roundHistory: [],
  finalEndingType: null,
  seenScenarioIds: [],
  sessionKey: 0,
};

export type CounterofferAction =
  | { type: "HYDRATE"; payload: CounterofferPersistence }
  | { type: "START"; scenario: CounterofferScenario }
  | { type: "CHANGE_LEVER"; leverId: LeverId; value: number }
  | { type: "SUBMIT_ROUND"; snapshot: SubmittedRoundSnapshot }
  | { type: "CONTINUE_TO_NEXT_ROUND" }
  | {
      type: "SHOW_ENDING";
      endingType: FinalEndingType;
      seenScenarioIds: string[];
    };

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function parseCounterofferPersistence(
  value: unknown,
): CounterofferPersistence | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Record<string, unknown>;
  if (
    candidate.version !== COUNTEROFFER_STORAGE_VERSION
    || !isStringArray(candidate.seenScenarioIds)
    || new Set(candidate.seenScenarioIds).size !== candidate.seenScenarioIds.length
  ) {
    return null;
  }

  return {
    version: COUNTEROFFER_STORAGE_VERSION,
    seenScenarioIds: [...candidate.seenScenarioIds],
  };
}

function getStartingValues(scenario: CounterofferScenario) {
  return Object.fromEntries(
    scenario.levers.map((lever) => [lever.id, lever.startingLearnerValue]),
  ) as LeverValues;
}

export function counterofferReducer(
  state: CounterofferState,
  action: CounterofferAction,
): CounterofferState {
  switch (action.type) {
    case "HYDRATE":
      if (state.phase !== "ready") return state;
      return { ...state, seenScenarioIds: [...action.payload.seenScenarioIds] };

    case "START":
      return {
        ...state,
        phase: "negotiating",
        activeScenario: action.scenario,
        currentRoundNumber: 1,
        editableValues: getStartingValues(action.scenario),
        roundHistory: [],
        finalEndingType: null,
        sessionKey: state.sessionKey + 1,
      };

    case "CHANGE_LEVER": {
      if (state.phase !== "negotiating" || !state.editableValues) return state;
      const lever = state.activeScenario?.levers.find(
        (item) => item.id === action.leverId,
      );
      if (!lever || action.value < lever.min || action.value > lever.max) return state;
      return {
        ...state,
        editableValues: {
          ...state.editableValues,
          [action.leverId]: action.value,
        },
      };
    }

    case "SUBMIT_ROUND":
      if (
        state.phase !== "negotiating"
        || action.snapshot.roundNumber !== state.currentRoundNumber
      ) {
        return state;
      }
      return {
        ...state,
        phase: "buyer-response",
        roundHistory: [...state.roundHistory, action.snapshot],
      };

    case "CONTINUE_TO_NEXT_ROUND": {
      if (state.phase !== "buyer-response" || state.currentRoundNumber >= 3) {
        return state;
      }
      const lastRound = state.roundHistory.at(-1);
      if (!lastRound) return state;
      return {
        ...state,
        phase: "negotiating",
        currentRoundNumber: (state.currentRoundNumber + 1) as 2 | 3,
        editableValues: { ...lastRound.submittedValues },
      };
    }

    case "SHOW_ENDING":
      if (
        state.phase !== "buyer-response"
        || state.currentRoundNumber !== 3
        || state.roundHistory.length !== 3
      ) {
        return state;
      }
      return {
        ...state,
        phase: "ending",
        finalEndingType: action.endingType,
        seenScenarioIds: [...action.seenScenarioIds],
      };

    default:
      return state;
  }
}
