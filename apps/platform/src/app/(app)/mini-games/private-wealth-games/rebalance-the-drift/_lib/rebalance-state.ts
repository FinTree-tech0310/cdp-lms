import type {
  AssetClass,
  RebalanceScenario,
} from "../_data/rebalance-scenarios";
import {
  redistributeAllocation,
  type AllocationRecord,
} from "./allocation-math";

export const REBALANCE_STORAGE_KEY =
  "cdp:private-wealth-games:rebalance-the-drift:v1";
export const REBALANCE_STORAGE_VERSION = 1;

export type RebalancePhase = "ready" | "adjusting" | "results";

export interface RebalancePersistence {
  version: typeof REBALANCE_STORAGE_VERSION;
  seenScenarioIds: string[];
}

export interface RebalanceState {
  phase: RebalancePhase;
  activeScenario: RebalanceScenario | null;
  workingAllocations: AllocationRecord | null;
  submittedAllocations: AllocationRecord | null;
  activeAssetClass: AssetClass | null;
  seenScenarioIds: string[];
  sessionKey: number;
}

export type RebalanceAction =
  | { type: "HYDRATE"; payload: RebalancePersistence }
  | {
      type: "START";
      scenario: RebalanceScenario;
      allocations: AllocationRecord;
      seenScenarioIds: string[];
    }
  | { type: "ADJUST"; requestedUnits: number; assetClass: AssetClass }
  | { type: "SET_ACTIVE_ASSET"; assetClass: AssetClass | null }
  | { type: "SUBMIT" };

export const INITIAL_REBALANCE_STATE: RebalanceState = {
  phase: "ready",
  activeScenario: null,
  workingAllocations: null,
  submittedAllocations: null,
  activeAssetClass: null,
  seenScenarioIds: [],
  sessionKey: 0,
};

export function parseRebalancePersistence(
  value: unknown,
): RebalancePersistence | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<RebalancePersistence>;
  if (
    candidate.version !== REBALANCE_STORAGE_VERSION
    || !Array.isArray(candidate.seenScenarioIds)
    || !candidate.seenScenarioIds.every((id) => typeof id === "string")
  ) {
    return null;
  }
  return {
    version: REBALANCE_STORAGE_VERSION,
    seenScenarioIds: [...new Set(candidate.seenScenarioIds)],
  };
}

export function rebalanceReducer(
  state: RebalanceState,
  action: RebalanceAction,
): RebalanceState {
  switch (action.type) {
    case "HYDRATE":
      if (state.phase !== "ready") return state;
      return { ...state, seenScenarioIds: action.payload.seenScenarioIds };
    case "START":
      return {
        ...state,
        phase: "adjusting",
        activeScenario: action.scenario,
        workingAllocations: action.allocations,
        submittedAllocations: null,
        activeAssetClass: null,
        seenScenarioIds: action.seenScenarioIds,
        sessionKey: state.sessionKey + 1,
      };
    case "ADJUST":
      if (state.phase !== "adjusting" || !state.workingAllocations) return state;
      return {
        ...state,
        workingAllocations: redistributeAllocation(
          state.workingAllocations,
          action.assetClass,
          action.requestedUnits,
        ),
        activeAssetClass: action.assetClass,
      };
    case "SET_ACTIVE_ASSET":
      if (state.phase !== "adjusting") return state;
      return { ...state, activeAssetClass: action.assetClass };
    case "SUBMIT":
      if (state.phase !== "adjusting" || !state.workingAllocations) return state;
      return {
        ...state,
        phase: "results",
        submittedAllocations: { ...state.workingAllocations },
        activeAssetClass: null,
      };
    default:
      return state;
  }
}
