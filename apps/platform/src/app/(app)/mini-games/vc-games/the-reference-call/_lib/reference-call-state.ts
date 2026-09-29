import type { FounderPitchTranscript, PitchJudgment } from "../_data/founder-pitch-transcripts";
import type { ReferenceCallTranscript } from "../_data/reference-call-transcripts";

export const LINE_DURATION_MS = 5_000;
export const REFERENCE_CALL_STORAGE_KEY = "cdp:vc-games:the-reference-call";
export const REFERENCE_CALL_STORAGE_VERSION = 2;

export type ReferenceGameMode = "reference-call" | "founder-pitch";

export interface ReferenceCallPersistence {
  version: number;
  seenReferenceCallIds: string[];
  seenFounderPitchIds: string[];
}

export interface ReferenceCallState {
  phase: "mode-selection" | "live" | "results";
  activeMode: ReferenceGameMode | null;
  preparedReference: ReferenceCallTranscript | null;
  preparedPitch: FounderPitchTranscript | null;
  activeLineIndex: number;
  flaggedLineIds: string[];
  pitchJudgments: Record<string, PitchJudgment>;
  seenReferenceCallIds: string[];
  seenFounderPitchIds: string[];
}

export const INITIAL_REFERENCE_CALL_STATE: ReferenceCallState = {
  phase: "mode-selection",
  activeMode: null,
  preparedReference: null,
  preparedPitch: null,
  activeLineIndex: -1,
  flaggedLineIds: [],
  pitchJudgments: {},
  seenReferenceCallIds: [],
  seenFounderPitchIds: [],
};

type ReferenceCallAction =
  | { type: "PREPARE_MODES"; reference: ReferenceCallTranscript; pitch: FounderPitchTranscript; seenReferenceCallIds: string[]; seenFounderPitchIds: string[] }
  | { type: "START_REFERENCE"; seenReferenceCallIds: string[] }
  | { type: "START_PITCH"; seenFounderPitchIds: string[] }
  | { type: "FLAG_ACTIVE_LINE"; lineId: string }
  | { type: "JUDGE_ACTIVE_LINE"; lineId: string; judgment: PitchJudgment }
  | { type: "ADVANCE" }
  | { type: "RETURN_TO_MODES"; reference?: ReferenceCallTranscript; pitch?: FounderPitchTranscript };

export function referenceCallReducer(state: ReferenceCallState, action: ReferenceCallAction): ReferenceCallState {
  switch (action.type) {
    case "PREPARE_MODES":
      return { ...INITIAL_REFERENCE_CALL_STATE, preparedReference: action.reference, preparedPitch: action.pitch, seenReferenceCallIds: action.seenReferenceCallIds, seenFounderPitchIds: action.seenFounderPitchIds };
    case "START_REFERENCE":
      if (!state.preparedReference) return state;
      return { ...state, phase: "live", activeMode: "reference-call", activeLineIndex: 0, flaggedLineIds: [], pitchJudgments: {}, seenReferenceCallIds: action.seenReferenceCallIds };
    case "START_PITCH":
      if (!state.preparedPitch) return state;
      return { ...state, phase: "live", activeMode: "founder-pitch", activeLineIndex: 0, flaggedLineIds: [], pitchJudgments: {}, seenFounderPitchIds: action.seenFounderPitchIds };
    case "FLAG_ACTIVE_LINE": {
      if (state.phase !== "live" || state.activeMode !== "reference-call" || !state.preparedReference) return state;
      const line = state.preparedReference.lines[state.activeLineIndex];
      if (!line || line.speaker !== "Reference" || line.id !== action.lineId || state.flaggedLineIds.includes(action.lineId)) return state;
      return { ...state, flaggedLineIds: [...state.flaggedLineIds, action.lineId] };
    }
    case "JUDGE_ACTIVE_LINE": {
      if (state.phase !== "live" || state.activeMode !== "founder-pitch" || !state.preparedPitch) return state;
      const line = state.preparedPitch.lines[state.activeLineIndex];
      if (!line || line.speaker !== "Founder" || line.id !== action.lineId || state.pitchJudgments[action.lineId]) return state;
      return { ...state, pitchJudgments: { ...state.pitchJudgments, [action.lineId]: action.judgment } };
    }
    case "ADVANCE": {
      if (state.phase !== "live" || !state.activeMode) return state;
      const transcript = state.activeMode === "reference-call" ? state.preparedReference : state.preparedPitch;
      if (!transcript) return state;
      return state.activeLineIndex >= transcript.lines.length - 1 ? { ...state, phase: "results" } : { ...state, activeLineIndex: state.activeLineIndex + 1 };
    }
    case "RETURN_TO_MODES":
      return { ...state, phase: "mode-selection", activeMode: null, preparedReference: action.reference ?? state.preparedReference, preparedPitch: action.pitch ?? state.preparedPitch, activeLineIndex: -1, flaggedLineIds: [], pitchJudgments: {} };
    default:
      return state;
  }
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function parseReferenceCallPersistence(value: unknown): ReferenceCallPersistence | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Record<string, unknown>;
  if (candidate.version === 1 && isStringArray(candidate.seenTranscriptIds)) {
    return { version: REFERENCE_CALL_STORAGE_VERSION, seenReferenceCallIds: candidate.seenTranscriptIds, seenFounderPitchIds: [] };
  }
  if (candidate.version !== REFERENCE_CALL_STORAGE_VERSION || !isStringArray(candidate.seenReferenceCallIds) || !isStringArray(candidate.seenFounderPitchIds)) return null;
  return { version: REFERENCE_CALL_STORAGE_VERSION, seenReferenceCallIds: candidate.seenReferenceCallIds, seenFounderPitchIds: candidate.seenFounderPitchIds };
}
