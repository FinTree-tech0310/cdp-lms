import {
  createWalkAwayHistory,
  getMinimumLegalRaise,
  hasLegalRaise,
  isLegalLearnerBid,
  resolveLearnerRaise,
} from "./bidding-war-resolution";
import type {
  AuctionRoundHistory,
  BiddingWarOutcome,
  BiddingWarScenario,
  ForcedOutReason,
} from "./bidding-war-types";

export const BIDDING_WAR_STORAGE_KEY =
  "cdp:investment-banking-games:bidding-war:v1";
export const BIDDING_WAR_STORAGE_VERSION = 1;

export interface BiddingWarPersistence {
  version: typeof BIDDING_WAR_STORAGE_VERSION;
  seenScenarioIds: string[];
}

export interface BiddingWarState {
  phase:
    | "ready"
    | "active"
    | "competitor-response"
    | "competitor-dropped"
    | "forced-out"
    | "resolved";
  actionMode: "choice" | "raise-editor" | "confirm-walk";
  activeScenario: BiddingWarScenario | null;
  currentRoundIndex: number;
  currentLeadingBid: number;
  currentProposedBid: number | null;
  auctionHistory: readonly AuctionRoundHistory[];
  forcedOutReason: ForcedOutReason | null;
  finalOutcome: BiddingWarOutcome | null;
  winningBid: number | null;
  seenScenarioIds: string[];
  sessionKey: number;
}

export const INITIAL_BIDDING_WAR_STATE: BiddingWarState = {
  phase: "ready",
  actionMode: "choice",
  activeScenario: null,
  currentRoundIndex: 0,
  currentLeadingBid: 0,
  currentProposedBid: null,
  auctionHistory: [],
  forcedOutReason: null,
  finalOutcome: null,
  winningBid: null,
  seenScenarioIds: [],
  sessionKey: 0,
};

export type BiddingWarAction =
  | { type: "HYDRATE"; payload: BiddingWarPersistence }
  | { type: "START"; scenario: BiddingWarScenario }
  | { type: "OPEN_RAISE" }
  | { type: "CANCEL_RAISE" }
  | { type: "CHANGE_PROPOSED_BID"; value: number }
  | { type: "OPEN_WALK_CONFIRMATION" }
  | { type: "CANCEL_WALK" }
  | { type: "SUBMIT_RAISE" }
  | { type: "CONTINUE_AFTER_COUNTER" }
  | { type: "REVIEW_WIN"; seenScenarioIds: string[] }
  | { type: "CONFIRM_WALK"; seenScenarioIds: string[] }
  | { type: "EXIT_FORCED"; seenScenarioIds: string[] };

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function parseBiddingWarPersistence(
  value: unknown,
): BiddingWarPersistence | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Record<string, unknown>;
  if (
    candidate.version !== BIDDING_WAR_STORAGE_VERSION
    || !isStringArray(candidate.seenScenarioIds)
    || new Set(candidate.seenScenarioIds).size !== candidate.seenScenarioIds.length
  ) {
    return null;
  }
  return {
    version: BIDDING_WAR_STORAGE_VERSION,
    seenScenarioIds: [...candidate.seenScenarioIds],
  };
}

export function biddingWarReducer(
  state: BiddingWarState,
  action: BiddingWarAction,
): BiddingWarState {
  switch (action.type) {
    case "HYDRATE":
      if (state.phase !== "ready") return state;
      return { ...state, seenScenarioIds: [...action.payload.seenScenarioIds] };

    case "START":
      return {
        ...state,
        phase: "active",
        actionMode: "choice",
        activeScenario: action.scenario,
        currentRoundIndex: 0,
        currentLeadingBid: action.scenario.startingBid,
        currentProposedBid: null,
        auctionHistory: [],
        forcedOutReason: null,
        finalOutcome: null,
        winningBid: null,
        sessionKey: state.sessionKey + 1,
      };

    case "OPEN_RAISE": {
      if (
        state.phase !== "active"
        || state.actionMode !== "choice"
        || !state.activeScenario
        || !hasLegalRaise(state.activeScenario, state.currentLeadingBid)
      ) return state;
      return {
        ...state,
        actionMode: "raise-editor",
        currentProposedBid: getMinimumLegalRaise(
          state.currentLeadingBid,
          state.activeScenario.minIncrement,
        ),
      };
    }

    case "CANCEL_RAISE":
      if (state.phase !== "active" || state.actionMode !== "raise-editor") return state;
      return { ...state, actionMode: "choice", currentProposedBid: null };

    case "CHANGE_PROPOSED_BID":
      if (
        state.phase !== "active"
        || state.actionMode !== "raise-editor"
        || !state.activeScenario
        || !isLegalLearnerBid(
          state.activeScenario,
          state.currentLeadingBid,
          action.value,
        )
      ) return state;
      return { ...state, currentProposedBid: action.value };

    case "OPEN_WALK_CONFIRMATION":
      if (state.phase !== "active" || state.actionMode !== "choice") return state;
      return { ...state, actionMode: "confirm-walk", currentProposedBid: null };

    case "CANCEL_WALK":
      if (state.phase !== "active" || state.actionMode !== "confirm-walk") return state;
      return { ...state, actionMode: "choice" };

    case "SUBMIT_RAISE": {
      if (
        state.phase !== "active"
        || state.actionMode !== "raise-editor"
        || !state.activeScenario
        || state.currentProposedBid === null
        || !isLegalLearnerBid(
          state.activeScenario,
          state.currentLeadingBid,
          state.currentProposedBid,
        )
      ) return state;

      const resolution = resolveLearnerRaise(
        state.activeScenario,
        state.currentRoundIndex,
        state.currentLeadingBid,
        state.currentProposedBid,
      );
      const auctionHistory = [...state.auctionHistory, resolution.history];

      if (resolution.kind === "competitor-dropped") {
        return {
          ...state,
          phase: "competitor-dropped",
          actionMode: "choice",
          currentLeadingBid: resolution.winningBid,
          currentProposedBid: null,
          auctionHistory,
          finalOutcome: resolution.finalOutcome,
          winningBid: resolution.winningBid,
        };
      }

      return {
        ...state,
        phase: resolution.forcedOutReason ? "forced-out" : "competitor-response",
        actionMode: "choice",
        currentLeadingBid: resolution.competitorBid,
        currentProposedBid: null,
        auctionHistory,
        forcedOutReason: resolution.forcedOutReason,
      };
    }

    case "CONTINUE_AFTER_COUNTER":
      if (
        state.phase !== "competitor-response"
        || !state.activeScenario
        || state.currentRoundIndex + 1 >= state.activeScenario.maxRounds
      ) return state;
      return {
        ...state,
        phase: "active",
        actionMode: "choice",
        currentRoundIndex: state.currentRoundIndex + 1,
      };

    case "REVIEW_WIN":
      if (state.phase !== "competitor-dropped" || !state.finalOutcome) return state;
      return {
        ...state,
        phase: "resolved",
        seenScenarioIds: [...action.seenScenarioIds],
      };

    case "CONFIRM_WALK":
      if (
        state.phase !== "active"
        || state.actionMode !== "confirm-walk"
        || !state.activeScenario
        || !hasLegalRaise(state.activeScenario, state.currentLeadingBid)
      ) return state;
      return {
        ...state,
        phase: "resolved",
        actionMode: "choice",
        auctionHistory: [
          ...state.auctionHistory,
          createWalkAwayHistory(state.currentRoundIndex, state.currentLeadingBid),
        ],
        finalOutcome: "walked-away",
        seenScenarioIds: [...action.seenScenarioIds],
      };

    case "EXIT_FORCED":
      if (state.phase !== "forced-out") return state;
      return {
        ...state,
        phase: "resolved",
        finalOutcome: "lost-to-competitor",
        seenScenarioIds: [...action.seenScenarioIds],
      };

    default:
      return state;
  }
}
