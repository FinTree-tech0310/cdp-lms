import type { VcDecision } from "../../_lib/decision-controls";
import type { PitchSet } from "../_data/pitch-sets";

export const PITCH_SPRINT_STORAGE_KEY = "cdp:vc-games:the-pitch-sprint:v1";
export const PITCH_SPRINT_STORAGE_VERSION = 1;

export type PitchSprintPhase = "ready" | "playing" | "reveal";
export type PitchChoice = Exclude<VcDecision, "maybe">;

export interface PitchDecision {
  cardId: string;
  choice: PitchChoice;
  timedOut: boolean;
  responseTimeMs: number;
}

export interface PitchSprintPersistence {
  version: typeof PITCH_SPRINT_STORAGE_VERSION;
  lastSetId: string | null;
}

export interface PitchSprintState {
  phase: PitchSprintPhase;
  activeSet: PitchSet | null;
  currentIndex: number;
  decisions: PitchDecision[];
  selectedChoice: PitchChoice | null;
  resolvedByTimeout: boolean;
  lastSetId: string | null;
}

export type PitchSprintAction =
  | { type: "HYDRATE"; payload: PitchSprintPersistence }
  | { type: "START_SPRINT"; pitchSet: PitchSet }
  | {
      type: "RESOLVE_CARD";
      cardId: string;
      choice: PitchChoice;
      timedOut: boolean;
      responseTimeMs: number;
    }
  | { type: "ADVANCE" };

export const INITIAL_PITCH_SPRINT_STATE: PitchSprintState = {
  phase: "ready",
  activeSet: null,
  currentIndex: 0,
  decisions: [],
  selectedChoice: null,
  resolvedByTimeout: false,
  lastSetId: null,
};

export function parsePitchSprintPersistence(value: unknown): PitchSprintPersistence | null {
  if (!value || typeof value !== "object") return null;

  const candidate = value as Partial<PitchSprintPersistence>;
  if (
    candidate.version !== PITCH_SPRINT_STORAGE_VERSION ||
    (candidate.lastSetId !== null && typeof candidate.lastSetId !== "string")
  ) {
    return null;
  }

  return {
    version: PITCH_SPRINT_STORAGE_VERSION,
    lastSetId: candidate.lastSetId ?? null,
  };
}

export function pitchSprintReducer(
  state: PitchSprintState,
  action: PitchSprintAction,
): PitchSprintState {
  switch (action.type) {
    case "HYDRATE":
      if (state.phase !== "ready") return state;
      return { ...state, lastSetId: action.payload.lastSetId };
    case "START_SPRINT":
      if (action.pitchSet.cards.length !== 5) {
        throw new Error("Every Pitch Sprint set must contain exactly five cards.");
      }
      return {
        ...state,
        phase: "playing",
        activeSet: action.pitchSet,
        currentIndex: 0,
        decisions: [],
        selectedChoice: null,
        resolvedByTimeout: false,
        lastSetId: action.pitchSet.id,
      };
    case "RESOLVE_CARD":
      if (state.phase !== "playing" || state.selectedChoice) return state;
      return {
        ...state,
        decisions: [
          ...state.decisions,
          {
            cardId: action.cardId,
            choice: action.choice,
            timedOut: action.timedOut,
            responseTimeMs: action.responseTimeMs,
          },
        ],
        selectedChoice: action.choice,
        resolvedByTimeout: action.timedOut,
      };
    case "ADVANCE":
      if (state.phase !== "playing" || !state.selectedChoice || !state.activeSet) return state;
      if (state.currentIndex >= state.activeSet.cards.length - 1) {
        return { ...state, phase: "reveal" };
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

export interface PitchSprintComparison {
  learnerChoices: Record<PitchChoice, number>;
  historicalSignals: Record<PitchChoice, number>;
  timeoutCount: number;
}

export function getPitchSprintComparison(
  pitchSet: PitchSet,
  decisions: readonly PitchDecision[],
): PitchSprintComparison {
  const learnerChoices: PitchSprintComparison["learnerChoices"] = {
    fund: 0,
    pass: 0,
  };
  const historicalSignals: PitchSprintComparison["historicalSignals"] = {
    fund: 0,
    pass: 0,
  };

  decisions.forEach((decision) => {
    learnerChoices[decision.choice] += 1;
  });
  pitchSet.cards.forEach((card) => {
    historicalSignals[card.referenceDecision] += 1;
  });

  return {
    learnerChoices,
    historicalSignals,
    timeoutCount: decisions.filter((decision) => decision.timedOut).length,
  };
}
