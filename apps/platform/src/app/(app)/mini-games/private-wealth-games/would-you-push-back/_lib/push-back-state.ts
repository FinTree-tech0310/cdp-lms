import type { PushBackRequest } from "../_data/push-back-sets";

export const PUSH_BACK_STORAGE_KEY =
  "cdp:private-wealth-games:would-you-push-back:v1";
export const PUSH_BACK_STORAGE_VERSION = 1;

export type PushBackDecision =
  | "advise-against"
  | "follow"
  | "compromise"
  | "skipped";
export type PushBackPhase = "ready" | "presenting" | "playing" | "results";

export interface PushBackPersistence {
  version: typeof PUSH_BACK_STORAGE_VERSION;
  seenSetIds: string[];
}

export interface PushBackState {
  phase: PushBackPhase;
  requests: PushBackRequest[];
  activeIndex: number;
  responses: Record<string, PushBackDecision>;
  resolvingDecision: PushBackDecision | null;
  seenSetIds: string[];
  sessionKey: number;
}

export type PushBackAction =
  | { type: "HYDRATE"; payload: PushBackPersistence }
  | {
      type: "START_SESSION";
      requests: PushBackRequest[];
      seenSetIds: string[];
    }
  | { type: "ACTIVATE_REQUEST" }
  | {
      type: "RECORD_DECISION";
      requestId: string;
      decision: PushBackDecision;
    }
  | { type: "ADVANCE" };

export const INITIAL_PUSH_BACK_STATE: PushBackState = {
  phase: "ready",
  requests: [],
  activeIndex: 0,
  responses: {},
  resolvingDecision: null,
  seenSetIds: [],
  sessionKey: 0,
};

export function parsePushBackPersistence(
  value: unknown,
): PushBackPersistence | null {
  if (!value || typeof value !== "object") return null;

  const candidate = value as Partial<PushBackPersistence>;
  if (
    candidate.version !== PUSH_BACK_STORAGE_VERSION
    || !Array.isArray(candidate.seenSetIds)
    || !candidate.seenSetIds.every((id) => typeof id === "string")
  ) {
    return null;
  }

  return {
    version: PUSH_BACK_STORAGE_VERSION,
    seenSetIds: [...new Set(candidate.seenSetIds)],
  };
}

export function pushBackReducer(
  state: PushBackState,
  action: PushBackAction,
): PushBackState {
  switch (action.type) {
    case "HYDRATE":
      if (state.phase !== "ready") return state;
      return { ...state, seenSetIds: action.payload.seenSetIds };
    case "START_SESSION":
      return {
        ...state,
        phase: "presenting",
        requests: action.requests,
        activeIndex: 0,
        responses: {},
        resolvingDecision: null,
        seenSetIds: action.seenSetIds,
        sessionKey: state.sessionKey + 1,
      };
    case "ACTIVATE_REQUEST":
      if (state.phase !== "presenting") return state;
      return { ...state, phase: "playing" };
    case "RECORD_DECISION":
      if (state.phase !== "playing" || state.resolvingDecision !== null) {
        return state;
      }
      return {
        ...state,
        responses: {
          ...state.responses,
          [action.requestId]: action.decision,
        },
        resolvingDecision: action.decision,
      };
    case "ADVANCE":
      if (state.phase !== "playing" || state.resolvingDecision === null) {
        return state;
      }
      if (state.activeIndex >= state.requests.length - 1) {
        return { ...state, phase: "results" };
      }
      return {
        ...state,
        phase: "presenting",
        activeIndex: state.activeIndex + 1,
        resolvingDecision: null,
      };
    default:
      return state;
  }
}
