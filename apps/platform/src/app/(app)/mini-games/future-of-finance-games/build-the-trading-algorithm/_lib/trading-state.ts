import { updateSeenItemIds } from "@/app/(app)/mini-games/vc-games/_lib/select-unseen-item";
import { createTradingResultSnapshot } from "./trading-result";
import { ENTRY_RULES, EXIT_RULES } from "./trading-rules";
import type { EntryRuleId, ExitRuleId, TradingResultSnapshot, TradingScenario } from "./trading-types";

export interface TradingState {
  phase: "ready" | "choosing" | "results";
  activeScenario: TradingScenario | null;
  selectedEntryRuleId: EntryRuleId | null;
  selectedExitRuleId: ExitRuleId | null;
  resultSnapshot: TradingResultSnapshot | null;
  seenScenarioIds: string[];
  sessionKey: number;
}

export const INITIAL_TRADING_STATE: TradingState = {
  phase: "ready",
  activeScenario: null,
  selectedEntryRuleId: null,
  selectedExitRuleId: null,
  resultSnapshot: null,
  seenScenarioIds: [],
  sessionKey: 0,
};

export type TradingAction =
  | { type: "HYDRATE"; seenScenarioIds: string[] }
  | { type: "START"; scenario: TradingScenario }
  | { type: "SELECT_ENTRY"; ruleId: EntryRuleId }
  | { type: "SELECT_EXIT"; ruleId: ExitRuleId }
  | { type: "RUN"; scenarioCount: number }
  | { type: "BACK_TO_INTRO" };

export function tradingReducer(state: TradingState, action: TradingAction): TradingState {
  switch (action.type) {
    case "HYDRATE":
      return state.phase === "ready" ? { ...state, seenScenarioIds: [...action.seenScenarioIds] } : state;
    case "START":
      return {
        ...state,
        phase: "choosing",
        activeScenario: action.scenario,
        selectedEntryRuleId: null,
        selectedExitRuleId: null,
        resultSnapshot: null,
        sessionKey: state.sessionKey + 1,
      };
    case "SELECT_ENTRY":
      if (state.phase !== "choosing" || !ENTRY_RULES.some((rule) => rule.id === action.ruleId)) return state;
      return { ...state, selectedEntryRuleId: action.ruleId };
    case "SELECT_EXIT":
      if (state.phase !== "choosing" || !EXIT_RULES.some((rule) => rule.id === action.ruleId)) return state;
      return { ...state, selectedExitRuleId: action.ruleId };
    case "RUN":
      if (state.phase !== "choosing" || !state.activeScenario || !state.selectedEntryRuleId || !state.selectedExitRuleId) return state;
      return {
        ...state,
        phase: "results",
        resultSnapshot: createTradingResultSnapshot(state.activeScenario, state.selectedEntryRuleId, state.selectedExitRuleId),
        seenScenarioIds: updateSeenItemIds(state.seenScenarioIds, state.activeScenario.id, action.scenarioCount),
      };
    case "BACK_TO_INTRO":
      return state.phase === "ready" ? state : {
        ...state,
        phase: "ready",
        activeScenario: null,
        selectedEntryRuleId: null,
        selectedExitRuleId: null,
        resultSnapshot: null,
      };
  }
}
