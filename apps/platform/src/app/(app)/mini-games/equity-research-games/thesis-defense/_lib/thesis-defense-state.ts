import { createDefenseResultSnapshot } from "./score-thesis-defense";
import type {
  DefenseAnswerRecord,
  DefenseOptionDisplayOrder,
  DefenseQuestion,
  DefenseQuestionNumber,
  DefenseResultSnapshot,
  ThesisDefenseScenario,
} from "./thesis-defense-types";

export const THESIS_DEFENSE_STORAGE_KEY =
  "cdp:equity-research-games:thesis-defense:v1";
export const THESIS_DEFENSE_STORAGE_VERSION = 1;

export interface ThesisDefensePersistence {
  version: typeof THESIS_DEFENSE_STORAGE_VERSION;
  seenScenarioIds: string[];
}

export interface ThesisDefenseState {
  phase: "ready" | "question" | "reaction" | "result";
  activeScenario: ThesisDefenseScenario | null;
  currentQuestionNumber: DefenseQuestionNumber;
  currentOptionDisplayOrder: DefenseOptionDisplayOrder | null;
  answerHistory: readonly DefenseAnswerRecord[];
  resultSnapshot: DefenseResultSnapshot | null;
  seenScenarioIds: string[];
  sessionKey: number;
}

export const INITIAL_THESIS_DEFENSE_STATE: ThesisDefenseState = {
  phase: "ready",
  activeScenario: null,
  currentQuestionNumber: 1,
  currentOptionDisplayOrder: null,
  answerHistory: [],
  resultSnapshot: null,
  seenScenarioIds: [],
  sessionKey: 0,
};

export type ThesisDefenseAction =
  | { type: "HYDRATE"; payload: ThesisDefensePersistence }
  | {
      type: "START";
      scenario: ThesisDefenseScenario;
      optionDisplayOrder: DefenseOptionDisplayOrder;
    }
  | { type: "SELECT_ANSWER"; selectedOptionId: string }
  | {
      type: "CONTINUE";
      optionDisplayOrder: DefenseOptionDisplayOrder;
    }
  | { type: "SHOW_RESULT"; seenScenarioIds: string[] };

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function parseThesisDefensePersistence(
  value: unknown,
): ThesisDefensePersistence | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Record<string, unknown>;
  if (
    candidate.version !== THESIS_DEFENSE_STORAGE_VERSION
    || !isStringArray(candidate.seenScenarioIds)
  ) {
    return null;
  }
  return {
    version: THESIS_DEFENSE_STORAGE_VERSION,
    seenScenarioIds: [...new Set(candidate.seenScenarioIds)],
  };
}

export function orderedDefenseQuestions(
  scenario: ThesisDefenseScenario,
): DefenseQuestion[] {
  return [...scenario.questions].sort(
    (first, second) => first.questionNumber - second.questionNumber,
  );
}

function currentQuestion(state: ThesisDefenseState): DefenseQuestion | null {
  if (!state.activeScenario) return null;
  return (
    orderedDefenseQuestions(state.activeScenario).find(
      (question) => question.questionNumber === state.currentQuestionNumber,
    ) ?? null
  );
}

export function thesisDefenseReducer(
  state: ThesisDefenseState,
  action: ThesisDefenseAction,
): ThesisDefenseState {
  switch (action.type) {
    case "HYDRATE":
      if (state.phase !== "ready") return state;
      return { ...state, seenScenarioIds: [...action.payload.seenScenarioIds] };

    case "START":
      return {
        ...state,
        phase: "question",
        activeScenario: action.scenario,
        currentQuestionNumber: 1,
        currentOptionDisplayOrder: action.optionDisplayOrder,
        answerHistory: [],
        resultSnapshot: null,
        sessionKey: state.sessionKey + 1,
      };

    case "SELECT_ANSWER": {
      if (state.phase !== "question" || !state.currentOptionDisplayOrder) {
        return state;
      }
      const question = currentQuestion(state);
      if (!question) return state;
      if (!state.currentOptionDisplayOrder.includes(action.selectedOptionId)) {
        return state;
      }
      const option = question.options.find(
        (candidate) => candidate.id === action.selectedOptionId,
      );
      if (!option) return state;

      const answerRecord: DefenseAnswerRecord = Object.freeze({
        questionId: question.id,
        questionNumber: question.questionNumber,
        pmQuestionText: question.pmQuestionText,
        selectedOptionId: option.id,
        selectedOptionLabel: option.label,
        scoreImpact: option.scoreImpact,
        pmReaction: option.pmReaction,
      });

      return {
        ...state,
        phase: "reaction",
        answerHistory: Object.freeze([...state.answerHistory, answerRecord]),
      };
    }

    case "CONTINUE":
      if (state.phase !== "reaction" || state.currentQuestionNumber === 4) {
        return state;
      }
      return {
        ...state,
        phase: "question",
        currentQuestionNumber: (state.currentQuestionNumber +
          1) as DefenseQuestionNumber,
        currentOptionDisplayOrder: action.optionDisplayOrder,
      };

    case "SHOW_RESULT":
      if (
        state.phase !== "reaction"
        || state.currentQuestionNumber !== 4
        || !state.activeScenario
        || state.answerHistory.length !== 4
      ) {
        return state;
      }
      return {
        ...state,
        phase: "result",
        resultSnapshot: createDefenseResultSnapshot(
          state.activeScenario,
          state.answerHistory,
        ),
        seenScenarioIds: [...action.seenScenarioIds],
      };

    default:
      return state;
  }
}
