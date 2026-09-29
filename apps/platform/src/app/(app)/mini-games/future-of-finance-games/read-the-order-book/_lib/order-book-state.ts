import { updateSeenItemIds } from "@/app/(app)/mini-games/vc-games/_lib/select-unseen-item";

import type { OrderBookResultSnapshot, OrderBookScenario } from "./order-book-types";

export interface OrderBookState {
  phase: "ready" | "reading" | "results";
  activeScenario: OrderBookScenario | null;
  displayAnswerOptions: string[];
  selectedAnswer: string | null;
  resultSnapshot: OrderBookResultSnapshot | null;
  seenScenarioIds: string[];
  sessionKey: number;
}

export const INITIAL_ORDER_BOOK_STATE: OrderBookState = {
  phase: "ready",
  activeScenario: null,
  displayAnswerOptions: [],
  selectedAnswer: null,
  resultSnapshot: null,
  seenScenarioIds: [],
  sessionKey: 0,
};

export type OrderBookAction =
  | { type: "HYDRATE"; seenScenarioIds: string[] }
  | { type: "START"; scenario: OrderBookScenario; displayAnswerOptions: string[] }
  | { type: "SELECT_ANSWER"; answer: string }
  | { type: "SUBMIT"; scenarioCount: number }
  | { type: "BACK_TO_INTRO" };

export function createOrderBookSnapshot(
  scenario: OrderBookScenario,
  displayAnswerOptions: readonly string[],
  selectedAnswer: string | null,
): OrderBookResultSnapshot | null {
  if (!selectedAnswer || !scenario.answerOptions.includes(selectedAnswer)) return null;
  return {
    scenarioId: scenario.id,
    marketContext: scenario.marketContext,
    currentPrice: scenario.currentPrice,
    sellOrders: scenario.sellOrders.map((level) => ({ ...level })),
    buyOrders: scenario.buyOrders.map((level) => ({ ...level })),
    questionText: scenario.questionText,
    displayAnswerOptions: [...displayAnswerOptions],
    selectedAnswer,
    correctInterpretation: scenario.correctInterpretation,
    matched: selectedAnswer === scenario.correctInterpretation,
    explanation: scenario.explanation,
    depthDescriptionForScreenReaders: scenario.depthDescriptionForScreenReaders,
  };
}

export function orderBookReducer(state: OrderBookState, action: OrderBookAction): OrderBookState {
  switch (action.type) {
    case "HYDRATE":
      return state.phase === "ready" ? { ...state, seenScenarioIds: [...action.seenScenarioIds] } : state;
    case "START":
      return {
        ...state,
        phase: "reading",
        activeScenario: action.scenario,
        displayAnswerOptions: [...action.displayAnswerOptions],
        selectedAnswer: null,
        resultSnapshot: null,
        sessionKey: state.sessionKey + 1,
      };
    case "SELECT_ANSWER":
      if (
        state.phase !== "reading"
        || !state.activeScenario?.answerOptions.includes(action.answer)
      ) return state;
      return { ...state, selectedAnswer: action.answer };
    case "SUBMIT": {
      if (state.phase !== "reading" || !state.activeScenario) return state;
      const snapshot = createOrderBookSnapshot(
        state.activeScenario,
        state.displayAnswerOptions,
        state.selectedAnswer,
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
          displayAnswerOptions: [],
          selectedAnswer: null,
          resultSnapshot: null,
        };
    default:
      return state;
  }
}
