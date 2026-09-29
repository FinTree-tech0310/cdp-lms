export type FounderInterrogationPhase =
  | "intro"
  | "hub"
  | "watching"
  | "decision-ready"
  | "reveal";
export type FounderDecision = "accept" | "reject";

export const FOUNDER_INTERROGATION_STORAGE_KEY = "cdp:vc-games:founder-interrogation-dev";
export const FOUNDER_INTERROGATION_STORAGE_VERSION = 1;

export interface FounderInterrogationPersistence {
  version: number;
  watchedPitchIds: string[];
}

export interface FounderInterrogationState {
  phase: FounderInterrogationPhase;
  activePitchId: string | null;
  decision: FounderDecision | null;
  watchedPitchIds: string[];
}

export const INITIAL_FOUNDER_INTERROGATION_STATE: FounderInterrogationState = {
  phase: "intro",
  activePitchId: null,
  decision: null,
  watchedPitchIds: [],
};

type FounderInterrogationAction =
  | { type: "HYDRATE"; payload: FounderInterrogationPersistence }
  | { type: "ENTER_LIBRARY" }
  | { type: "BACK_TO_INTRO" }
  | { type: "OPEN_PITCH"; pitchId: string }
  | { type: "MAKE_DECISION_READY" }
  | { type: "DECIDE"; decision: FounderDecision }
  | { type: "BACK_TO_VIDEOS" };

export function founderInterrogationReducer(
  state: FounderInterrogationState,
  action: FounderInterrogationAction,
): FounderInterrogationState {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, watchedPitchIds: action.payload.watchedPitchIds };
    case "ENTER_LIBRARY":
      return state.phase === "intro" ? { ...state, phase: "hub" } : state;
    case "BACK_TO_INTRO":
      return state.phase === "hub" ? { ...state, phase: "intro" } : state;
    case "OPEN_PITCH":
      return {
        ...state,
        phase: "watching",
        activePitchId: action.pitchId,
        decision: null,
      };
    case "MAKE_DECISION_READY":
      return state.phase === "watching" ? { ...state, phase: "decision-ready" } : state;
    case "DECIDE":
      if (state.phase !== "decision-ready" || !state.activePitchId || state.decision) return state;
      return {
        ...state,
        phase: "reveal",
        decision: action.decision,
        watchedPitchIds: [...new Set([...state.watchedPitchIds, state.activePitchId])],
      };
    case "BACK_TO_VIDEOS":
      return {
        ...state,
        phase: "hub",
        activePitchId: null,
        decision: null,
      };
    default:
      return state;
  }
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function parseFounderInterrogationPersistence(
  value: unknown,
): FounderInterrogationPersistence | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<FounderInterrogationPersistence>;
  if (candidate.version !== FOUNDER_INTERROGATION_STORAGE_VERSION) return null;
  if (!isStringArray(candidate.watchedPitchIds)) return null;
  return {
    version: FOUNDER_INTERROGATION_STORAGE_VERSION,
    watchedPitchIds: [...new Set(candidate.watchedPitchIds)],
  };
}
