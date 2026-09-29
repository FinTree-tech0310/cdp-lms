import { updateSeenItemIds } from "@/app/(app)/mini-games/vc-games/_lib/select-unseen-item";

import { createTriageSnapshot } from "./fraud-triage-snapshot";
import { isTriageAction } from "./triage-actions";
import type {
  FraudTriageResultSnapshot,
  FraudTriageScenarioSet,
  TransactionAssignments,
  TriageAction,
} from "./fraud-triage-types";

export interface FraudTriageState {
  phase: "ready" | "reviewing" | "results";
  activeScenario: FraudTriageScenarioSet | null;
  assignments: TransactionAssignments;
  resultSnapshot: FraudTriageResultSnapshot | null;
  seenScenarioIds: string[];
  sessionKey: number;
}

export const INITIAL_FRAUD_TRIAGE_STATE: FraudTriageState = {
  phase: "ready",
  activeScenario: null,
  assignments: {},
  resultSnapshot: null,
  seenScenarioIds: [],
  sessionKey: 0,
};

export type FraudTriageAction =
  | { type: "HYDRATE"; seenScenarioIds: string[] }
  | { type: "START"; scenario: FraudTriageScenarioSet }
  | { type: "ASSIGN"; transactionId: string; decision: TriageAction }
  | { type: "SUBMIT"; scenarioCount: number }
  | { type: "BACK_TO_INTRO" };

export function fraudTriageReducer(state: FraudTriageState, action: FraudTriageAction): FraudTriageState {
  switch (action.type) {
    case "HYDRATE":
      return state.phase === "ready" ? { ...state, seenScenarioIds: [...action.seenScenarioIds] } : state;
    case "START":
      return {
        ...state,
        phase: "reviewing",
        activeScenario: action.scenario,
        assignments: Object.fromEntries(action.scenario.transactions.map(({ id }) => [id, undefined])),
        resultSnapshot: null,
        sessionKey: state.sessionKey + 1,
      };
    case "ASSIGN":
      if (
        state.phase !== "reviewing"
        || !state.activeScenario?.transactions.some(({ id }) => id === action.transactionId)
        || !isTriageAction(action.decision)
      ) return state;
      return {
        ...state,
        assignments: { ...state.assignments, [action.transactionId]: action.decision },
      };
    case "SUBMIT": {
      if (state.phase !== "reviewing" || !state.activeScenario) return state;
      const resultSnapshot = createTriageSnapshot(state.activeScenario, state.assignments);
      if (!resultSnapshot) return state;
      return {
        ...state,
        phase: "results",
        resultSnapshot,
        seenScenarioIds: updateSeenItemIds(
          state.seenScenarioIds,
          state.activeScenario.id,
          action.scenarioCount,
        ),
      };
    }
    case "BACK_TO_INTRO":
      return state.phase === "ready"
        ? state
        : { ...state, phase: "ready", activeScenario: null, assignments: {}, resultSnapshot: null };
    default:
      return state;
  }
}
