import { updateSeenItemIds } from "@/app/(app)/mini-games/vc-games/_lib/select-unseen-item";

import type { SmartContractResultSnapshot, SmartContractScenario } from "./smart-contract-types";

export interface SmartContractState {
  phase: "ready" | "lineSelection" | "typeSelection" | "results";
  activeScenario: SmartContractScenario | null;
  displayTypeOptionIds: string[];
  selectedLineId: string | null;
  confirmedLineId: string | null;
  selectedTypeId: string | null;
  resultSnapshot: SmartContractResultSnapshot | null;
  seenScenarioIds: string[];
  sessionKey: number;
}

export const INITIAL_SMART_CONTRACT_STATE: SmartContractState = {
  phase: "ready",
  activeScenario: null,
  displayTypeOptionIds: [],
  selectedLineId: null,
  confirmedLineId: null,
  selectedTypeId: null,
  resultSnapshot: null,
  seenScenarioIds: [],
  sessionKey: 0,
};

export type SmartContractAction =
  | { type: "HYDRATE"; seenScenarioIds: string[] }
  | { type: "START"; scenario: SmartContractScenario; displayTypeOptionIds: string[] }
  | { type: "SELECT_LINE"; lineId: string }
  | { type: "CONFIRM_LINE" }
  | { type: "SELECT_TYPE"; typeId: string }
  | { type: "SUBMIT"; scenarioCount: number }
  | { type: "BACK_TO_INTRO" };

export function createSmartContractSnapshot(
  scenario: SmartContractScenario,
  confirmedLineId: string | null,
  selectedTypeId: string | null,
  displayTypeOptionIds: readonly string[],
): SmartContractResultSnapshot | null {
  if (!confirmedLineId || !scenario.lines.some(({ id }) => id === confirmedLineId)) return null;
  const selectedType = scenario.vulnerabilityTypeOptions.find(({ id }) => id === selectedTypeId);
  const correctType = scenario.vulnerabilityTypeOptions.find(({ id }) => id === scenario.correctTypeId);
  if (!selectedType || !correctType) return null;
  const selectedTypeFeedback = scenario.feedbackByOption[selectedType.id];
  if (typeof selectedTypeFeedback !== "string" || !selectedTypeFeedback.trim()) return null;

  return {
    scenarioId: scenario.id,
    functionContext: scenario.functionContext,
    lines: scenario.lines.map((line) => ({
      id: line.id,
      lineNumber: line.lineNumber,
      code: line.code,
      isVulnerableLine: line.isVulnerableLine,
      lineExplanation: line.lineExplanation,
      wasLearnerSelected: line.id === confirmedLineId,
    })),
    selectedLineId: confirmedLineId,
    vulnerableLineId: scenario.vulnerableLineId,
    lineMatched: confirmedLineId === scenario.vulnerableLineId,
    selectedTypeId: selectedType.id,
    selectedTypeLabel: selectedType.label,
    correctTypeId: correctType.id,
    correctTypeLabel: correctType.label,
    typeMatched: selectedType.id === correctType.id,
    selectedTypeFeedback,
    displayTypeOptionIds: [...displayTypeOptionIds],
  };
}

export function smartContractReducer(state: SmartContractState, action: SmartContractAction): SmartContractState {
  switch (action.type) {
    case "HYDRATE":
      return state.phase === "ready" ? { ...state, seenScenarioIds: [...action.seenScenarioIds] } : state;
    case "START":
      return {
        ...state,
        phase: "lineSelection",
        activeScenario: action.scenario,
        displayTypeOptionIds: [...action.displayTypeOptionIds],
        selectedLineId: null,
        confirmedLineId: null,
        selectedTypeId: null,
        resultSnapshot: null,
        sessionKey: state.sessionKey + 1,
      };
    case "SELECT_LINE":
      if (state.phase !== "lineSelection" || !state.activeScenario?.lines.some(({ id }) => id === action.lineId)) return state;
      return { ...state, selectedLineId: action.lineId };
    case "CONFIRM_LINE":
      if (state.phase !== "lineSelection" || !state.selectedLineId) return state;
      return { ...state, phase: "typeSelection", confirmedLineId: state.selectedLineId };
    case "SELECT_TYPE":
      if (
        state.phase !== "typeSelection"
        || !state.activeScenario?.vulnerabilityTypeOptions.some(({ id }) => id === action.typeId)
      ) return state;
      return { ...state, selectedTypeId: action.typeId };
    case "SUBMIT": {
      if (state.phase !== "typeSelection" || !state.activeScenario) return state;
      const snapshot = createSmartContractSnapshot(
        state.activeScenario,
        state.confirmedLineId,
        state.selectedTypeId,
        state.displayTypeOptionIds,
      );
      if (!snapshot) return state;
      return {
        ...state,
        phase: "results",
        resultSnapshot: snapshot,
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
        : {
          ...state,
          phase: "ready",
          activeScenario: null,
          displayTypeOptionIds: [],
          selectedLineId: null,
          confirmedLineId: null,
          selectedTypeId: null,
          resultSnapshot: null,
        };
    default:
      return state;
  }
}
