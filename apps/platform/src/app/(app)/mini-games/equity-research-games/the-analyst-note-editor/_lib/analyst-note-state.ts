import type {
  AnalystNoteResultSnapshot,
  AnalystNoteScenario,
  NoteReviewRecord,
} from "./analyst-note-types";

export const ANALYST_NOTE_STORAGE_KEY =
  "cdp:equity-research-games:the-analyst-note-editor:v1";
export const ANALYST_NOTE_STORAGE_VERSION = 1;

export interface AnalystNotePersistence {
  version: typeof ANALYST_NOTE_STORAGE_VERSION;
  seenScenarioIds: string[];
}

export interface AnalystNoteState {
  phase: "ready" | "reviewing" | "result";
  activeScenario: AnalystNoteScenario | null;
  flaggedLineIds: readonly string[];
  resultSnapshot: AnalystNoteResultSnapshot | null;
  seenScenarioIds: string[];
  sessionKey: number;
}

export const INITIAL_ANALYST_NOTE_STATE: AnalystNoteState = {
  phase: "ready",
  activeScenario: null,
  flaggedLineIds: [],
  resultSnapshot: null,
  seenScenarioIds: [],
  sessionKey: 0,
};

export type AnalystNoteAction =
  | { type: "HYDRATE"; payload: AnalystNotePersistence }
  | { type: "START"; scenario: AnalystNoteScenario }
  | { type: "TOGGLE_LINE"; lineId: string }
  | { type: "SUBMIT"; seenScenarioIds: string[] };

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function parseAnalystNotePersistence(
  value: unknown,
): AnalystNotePersistence | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Record<string, unknown>;
  if (
    candidate.version !== ANALYST_NOTE_STORAGE_VERSION
    || !isStringArray(candidate.seenScenarioIds)
  ) {
    return null;
  }
  return {
    version: ANALYST_NOTE_STORAGE_VERSION,
    seenScenarioIds: [...new Set(candidate.seenScenarioIds)],
  };
}

export function createAnalystNoteResultSnapshot(
  scenario: AnalystNoteScenario,
  flaggedLineIds: readonly string[],
): AnalystNoteResultSnapshot {
  const flaggedIds = new Set(flaggedLineIds);
  const lines = scenario.lines.map((line): NoteReviewRecord => {
    const learnerFlagged = flaggedIds.has(line.id);
    return Object.freeze({
      lineId: line.id,
      text: line.text,
      learnerFlagged,
      isProblematic: line.isProblematic,
      matched: learnerFlagged === line.isProblematic,
      reasoning: line.reasoning,
    });
  });

  return Object.freeze({
    scenarioId: scenario.id,
    lines: Object.freeze(lines),
  });
}

export function analystNoteReducer(
  state: AnalystNoteState,
  action: AnalystNoteAction,
): AnalystNoteState {
  switch (action.type) {
    case "HYDRATE":
      if (state.phase !== "ready") return state;
      return { ...state, seenScenarioIds: [...action.payload.seenScenarioIds] };

    case "START":
      return {
        ...state,
        phase: "reviewing",
        activeScenario: action.scenario,
        flaggedLineIds: [],
        resultSnapshot: null,
        sessionKey: state.sessionKey + 1,
      };

    case "TOGGLE_LINE": {
      if (
        state.phase !== "reviewing"
        || !state.activeScenario?.lines.some((line) => line.id === action.lineId)
      ) {
        return state;
      }
      const isFlagged = state.flaggedLineIds.includes(action.lineId);
      return {
        ...state,
        flaggedLineIds: isFlagged
          ? state.flaggedLineIds.filter((lineId) => lineId !== action.lineId)
          : [...state.flaggedLineIds, action.lineId],
      };
    }

    case "SUBMIT":
      if (state.phase !== "reviewing" || !state.activeScenario) return state;
      return {
        ...state,
        phase: "result",
        resultSnapshot: createAnalystNoteResultSnapshot(
          state.activeScenario,
          state.flaggedLineIds,
        ),
        seenScenarioIds: [...action.seenScenarioIds],
      };

    default:
      return state;
  }
}
