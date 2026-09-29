import type { CompsScenario } from "../_data/comps-scenarios";

export type CandidatePlacement = "unscreened" | "include" | "exclude";
export type FinalCandidatePlacement = Exclude<CandidatePlacement, "unscreened">;

export const COMPS_SCREEN_STORAGE_KEY =
  "cdp:investment-banking-games:the-comps-screen:v1";
export const COMPS_SCREEN_STORAGE_VERSION = 1;

export interface CompsScreenPersistence {
  version: typeof COMPS_SCREEN_STORAGE_VERSION;
  seenScenarioIds: string[];
  lastCandidateOrders: Record<string, string[]>;
}

interface CompsScreenState {
  phase: "ready" | "screening" | "results";
  activeScenario: CompsScenario | null;
  candidateOrder: string[];
  placements: Record<string, CandidatePlacement>;
  finalPlacements: Record<string, FinalCandidatePlacement> | null;
  seenScenarioIds: string[];
  lastCandidateOrders: Record<string, string[]>;
  sessionKey: number;
}

export const INITIAL_COMPS_SCREEN_STATE: CompsScreenState = {
  phase: "ready",
  activeScenario: null,
  candidateOrder: [],
  placements: {},
  finalPlacements: null,
  seenScenarioIds: [],
  lastCandidateOrders: {},
  sessionKey: 0,
};

type CompsScreenAction =
  | { type: "HYDRATE"; payload: CompsScreenPersistence }
  | {
      type: "START";
      scenario: CompsScenario;
      candidateOrder: string[];
    }
  | {
      type: "MOVE_CANDIDATE";
      candidateId: string;
      placement: CandidatePlacement;
    }
  | { type: "SUBMIT"; seenScenarioIds: string[] };

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function hasUniqueValues(values: readonly string[]) {
  return new Set(values).size === values.length;
}

export function parseCompsScreenPersistence(
  value: unknown,
): CompsScreenPersistence | null {
  if (!value || typeof value !== "object") return null;

  const candidate = value as Record<string, unknown>;
  if (
    candidate.version !== COMPS_SCREEN_STORAGE_VERSION
    || !isStringArray(candidate.seenScenarioIds)
    || !hasUniqueValues(candidate.seenScenarioIds)
    || !candidate.lastCandidateOrders
    || typeof candidate.lastCandidateOrders !== "object"
    || Array.isArray(candidate.lastCandidateOrders)
  ) {
    return null;
  }

  const lastCandidateOrders: Record<string, string[]> = {};
  for (const [scenarioId, order] of Object.entries(candidate.lastCandidateOrders)) {
    if (
      scenarioId.trim().length === 0
      || !isStringArray(order)
      || !hasUniqueValues(order)
    ) {
      return null;
    }
    lastCandidateOrders[scenarioId] = [...order];
  }

  return {
    version: COMPS_SCREEN_STORAGE_VERSION,
    seenScenarioIds: [...candidate.seenScenarioIds],
    lastCandidateOrders,
  };
}

export function compsScreenReducer(
  state: CompsScreenState,
  action: CompsScreenAction,
): CompsScreenState {
  switch (action.type) {
    case "HYDRATE":
      if (state.phase !== "ready") return state;
      return {
        ...state,
        seenScenarioIds: action.payload.seenScenarioIds,
        lastCandidateOrders: action.payload.lastCandidateOrders,
      };

    case "START": {
      const placements = Object.fromEntries(
        action.scenario.candidates.map((candidate) => [candidate.id, "unscreened"]),
      ) as Record<string, CandidatePlacement>;

      return {
        ...state,
        phase: "screening",
        activeScenario: action.scenario,
        candidateOrder: [...action.candidateOrder],
        placements,
        finalPlacements: null,
        lastCandidateOrders: {
          ...state.lastCandidateOrders,
          [action.scenario.id]: [...action.candidateOrder],
        },
        sessionKey: state.sessionKey + 1,
      };
    }

    case "MOVE_CANDIDATE":
      if (
        state.phase !== "screening"
        || !state.activeScenario?.candidates.some(
          (candidate) => candidate.id === action.candidateId,
        )
      ) {
        return state;
      }

      return {
        ...state,
        placements: {
          ...state.placements,
          [action.candidateId]: action.placement,
        },
      };

    case "SUBMIT": {
      if (!state.activeScenario || state.phase !== "screening") return state;

      const allAssigned = state.activeScenario.candidates.every((candidate) => {
        const placement = state.placements[candidate.id];
        return placement === "include" || placement === "exclude";
      });
      if (!allAssigned) return state;

      const finalPlacements = Object.fromEntries(
        state.activeScenario.candidates.map((candidate) => [
          candidate.id,
          state.placements[candidate.id] as FinalCandidatePlacement,
        ]),
      ) as Record<string, FinalCandidatePlacement>;

      return {
        ...state,
        phase: "results",
        finalPlacements,
        seenScenarioIds: [...action.seenScenarioIds],
      };
    }

    default:
      return state;
  }
}
