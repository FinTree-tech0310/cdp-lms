import type { DealSignal } from "../_data/signals";
import type { VcDecision } from "../../_lib/decision-controls";

export const DEAL_SPEED_STORAGE_KEY = "cdp:vc-games:deal-speed-round:v1";
export const DEAL_SPEED_STORAGE_VERSION = 1;

export type DealChoice = VcDecision;
export type RecordedDealChoice = DealChoice | "timeout";
export type DealSpeedPhase = "ready" | "playing" | "results";

export interface DealDecision {
  signalId: string;
  choice: RecordedDealChoice;
  responseTimeMs: number;
}

export interface DealChoiceCounts {
  fund: number;
  pass: number;
  maybe: number;
}

export interface DealSpeedPersistence {
  version: typeof DEAL_SPEED_STORAGE_VERSION;
  bestStreak: number;
  recentSignalIds: string[];
}

export interface DealSpeedRoundState {
  phase: DealSpeedPhase;
  signals: DealSignal[];
  currentIndex: number;
  decisions: DealDecision[];
  decisionsMade: number;
  currentStreak: number;
  finalStreak: number;
  bestStreak: number;
  bestStreakAtSessionStart: number;
  timeoutCount: number;
  choiceCounts: DealChoiceCounts;
  isNewBestStreak: boolean;
  fallbackMessageIndex: number;
  recentSignalIds: string[];
  selectedChoice: DealChoice | null;
  resolvedByTimeout: boolean;
}

export type DealSpeedRoundAction =
  | { type: "HYDRATE"; payload: DealSpeedPersistence }
  | {
      type: "START_SESSION";
      signals: DealSignal[];
      recentSignalIds: string[];
      fallbackMessageIndex: number;
    }
  | {
      type: "RESOLVE_SIGNAL";
      signalId: string;
      choice: DealChoice;
      timedOut: boolean;
      responseTimeMs: number;
    }
  | { type: "ADVANCE" };

export const INITIAL_DEAL_SPEED_STATE: DealSpeedRoundState = {
  phase: "ready",
  signals: [],
  currentIndex: 0,
  decisions: [],
  decisionsMade: 0,
  currentStreak: 0,
  finalStreak: 0,
  bestStreak: 0,
  bestStreakAtSessionStart: 0,
  timeoutCount: 0,
  choiceCounts: { fund: 0, pass: 0, maybe: 0 },
  isNewBestStreak: false,
  fallbackMessageIndex: -1,
  recentSignalIds: [],
  selectedChoice: null,
  resolvedByTimeout: false,
};

export function parseDealSpeedPersistence(value: unknown): DealSpeedPersistence | null {
  if (!value || typeof value !== "object") return null;

  const candidate = value as Partial<DealSpeedPersistence>;
  if (
    candidate.version !== DEAL_SPEED_STORAGE_VERSION ||
    !Number.isInteger(candidate.bestStreak) ||
    (candidate.bestStreak ?? -1) < 0 ||
    !Array.isArray(candidate.recentSignalIds) ||
    !candidate.recentSignalIds.every((id) => typeof id === "string")
  ) {
    return null;
  }

  return {
    version: DEAL_SPEED_STORAGE_VERSION,
    bestStreak: candidate.bestStreak as number,
    recentSignalIds: candidate.recentSignalIds.slice(-16),
  };
}

export function dealSpeedRoundReducer(
  state: DealSpeedRoundState,
  action: DealSpeedRoundAction,
): DealSpeedRoundState {
  switch (action.type) {
    case "HYDRATE":
      if (state.phase !== "ready") return state;
      return {
        ...state,
        bestStreak: action.payload.bestStreak,
        recentSignalIds: action.payload.recentSignalIds,
      };
    case "START_SESSION":
      return {
        ...state,
        phase: "playing",
        signals: action.signals,
        currentIndex: 0,
        decisions: [],
        decisionsMade: 0,
        currentStreak: 0,
        finalStreak: 0,
        bestStreakAtSessionStart: state.bestStreak,
        timeoutCount: 0,
        choiceCounts: { fund: 0, pass: 0, maybe: 0 },
        isNewBestStreak: false,
        fallbackMessageIndex: action.fallbackMessageIndex,
        recentSignalIds: action.recentSignalIds,
        selectedChoice: null,
        resolvedByTimeout: false,
      };
    case "RESOLVE_SIGNAL": {
      if (state.phase !== "playing" || state.selectedChoice) return state;

      const nextStreak = action.timedOut ? 0 : state.currentStreak + 1;
      const nextBestStreak = Math.max(state.bestStreak, nextStreak);
      return {
        ...state,
        decisions: [
          ...state.decisions,
          {
            signalId: action.signalId,
            choice: action.timedOut ? "timeout" : action.choice,
            responseTimeMs: action.responseTimeMs,
          },
        ],
        decisionsMade: state.decisionsMade + (action.timedOut ? 0 : 1),
        currentStreak: nextStreak,
        bestStreak: nextBestStreak,
        timeoutCount: state.timeoutCount + (action.timedOut ? 1 : 0),
        choiceCounts: action.timedOut
          ? state.choiceCounts
          : {
              ...state.choiceCounts,
              [action.choice]: state.choiceCounts[action.choice] + 1,
            },
        isNewBestStreak:
          state.isNewBestStreak || nextBestStreak > state.bestStreakAtSessionStart,
        selectedChoice: action.choice,
        resolvedByTimeout: action.timedOut,
      };
    }
    case "ADVANCE":
      if (state.phase !== "playing" || !state.selectedChoice) return state;
      if (state.currentIndex >= state.signals.length - 1) {
        return { ...state, phase: "results", finalStreak: state.currentStreak };
      }
      return {
        ...state,
        currentIndex: state.currentIndex + 1,
        selectedChoice: null,
        resolvedByTimeout: false,
      };
    default:
      return state;
  }
}
