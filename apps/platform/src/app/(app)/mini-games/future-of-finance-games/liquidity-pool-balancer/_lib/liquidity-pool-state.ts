import { updateSeenItemIds } from "@/app/(app)/mini-games/vc-games/_lib/select-unseen-item";
import { createLiquidityPoolResultSnapshot } from "./liquidity-pool-result";
import { normalizeSwapAmount } from "./swap-slider-grid";
import type { LiquidityPoolResultSnapshot, LiquidityPoolScenario } from "./liquidity-pool-types";

export interface LiquidityPoolState {
  phase: "ready" | "adjusting" | "results";
  activeScenario: LiquidityPoolScenario | null;
  currentSwapAmount: number | null;
  resultSnapshot: LiquidityPoolResultSnapshot | null;
  seenScenarioIds: string[];
  sessionKey: number;
}

export const INITIAL_LIQUIDITY_POOL_STATE: LiquidityPoolState = {
  phase: "ready",
  activeScenario: null,
  currentSwapAmount: null,
  resultSnapshot: null,
  seenScenarioIds: [],
  sessionKey: 0,
};

export type LiquidityPoolAction =
  | { type: "HYDRATE"; seenScenarioIds: string[] }
  | { type: "START"; scenario: LiquidityPoolScenario }
  | { type: "SET_SWAP_AMOUNT"; amount: number }
  | { type: "SUBMIT"; scenarioCount: number }
  | { type: "BACK_TO_INTRO" };

export function liquidityPoolReducer(state: LiquidityPoolState, action: LiquidityPoolAction): LiquidityPoolState {
  switch (action.type) {
    case "HYDRATE":
      return state.phase === "ready" ? { ...state, seenScenarioIds: [...action.seenScenarioIds] } : state;
    case "START":
      return {
        ...state,
        phase: "adjusting",
        activeScenario: action.scenario,
        currentSwapAmount: action.scenario.startingSwapAmount,
        resultSnapshot: null,
        sessionKey: state.sessionKey + 1,
      };
    case "SET_SWAP_AMOUNT": {
      if (state.phase !== "adjusting" || !state.activeScenario || !Number.isFinite(action.amount)) return state;
      const amount = normalizeSwapAmount(state.activeScenario, action.amount);
      return amount === state.currentSwapAmount ? state : { ...state, currentSwapAmount: amount };
    }
    case "SUBMIT": {
      if (state.phase !== "adjusting" || !state.activeScenario || state.currentSwapAmount === null) return state;
      return {
        ...state,
        phase: "results",
        resultSnapshot: createLiquidityPoolResultSnapshot(state.activeScenario, state.currentSwapAmount),
        seenScenarioIds: updateSeenItemIds(state.seenScenarioIds, state.activeScenario.id, action.scenarioCount),
      };
    }
    case "BACK_TO_INTRO":
      return state.phase === "ready" ? state : {
        ...state,
        phase: "ready",
        activeScenario: null,
        currentSwapAmount: null,
        resultSnapshot: null,
      };
    default:
      return state;
  }
}
