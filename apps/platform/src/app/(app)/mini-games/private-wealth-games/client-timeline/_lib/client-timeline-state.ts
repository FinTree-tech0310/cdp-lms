import type {
  ApproachTag,
  ClientTimelineScenario,
} from "../_data/client-timeline-scenarios";

export const CLIENT_TIMELINE_STORAGE_KEY =
  "cdp:private-wealth-games:client-timeline:v1";
export const CLIENT_TIMELINE_STORAGE_VERSION = 1;

export type ClientTimelinePhase =
  | "ready"
  | "client-intro"
  | "stop-decision"
  | "resolving-choice"
  | "stop-consequence"
  | "advancing"
  | "ending";

export interface TimelineChoice {
  stopId: string;
  optionId: string;
  optionLabel: string;
  approachTag: ApproachTag;
}

export interface ClientTimelinePersistence {
  version: typeof CLIENT_TIMELINE_STORAGE_VERSION;
  seenScenarioIds: string[];
}

export interface ClientTimelineState {
  phase: ClientTimelinePhase;
  activeScenario: ClientTimelineScenario | null;
  currentStopIndex: number;
  pendingStopIndex: number | null;
  choices: TimelineChoice[];
  displayedOptionIdsByStop: Record<string, [string, string]>;
  seenScenarioIds: string[];
  sessionKey: number;
}

export type ClientTimelineAction =
  | { type: "HYDRATE"; payload: ClientTimelinePersistence }
  | { type: "START"; scenario: ClientTimelineScenario }
  | { type: "BEGIN_TIMELINE"; stopId: string; optionIds: [string, string] }
  | { type: "SELECT_OPTION"; choice: TimelineChoice }
  | { type: "SHOW_CONSEQUENCE" }
  | {
      type: "BEGIN_ADVANCE";
      pendingStopIndex: number;
      stopId: string;
      optionIds: [string, string];
    }
  | { type: "COMPLETE_ADVANCE" }
  | { type: "SHOW_ENDING"; seenScenarioIds: string[] };

export const INITIAL_CLIENT_TIMELINE_STATE: ClientTimelineState = {
  phase: "ready",
  activeScenario: null,
  currentStopIndex: 0,
  pendingStopIndex: null,
  choices: [],
  displayedOptionIdsByStop: {},
  seenScenarioIds: [],
  sessionKey: 0,
};

export function parseClientTimelinePersistence(
  value: unknown,
): ClientTimelinePersistence | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<ClientTimelinePersistence>;
  if (
    candidate.version !== CLIENT_TIMELINE_STORAGE_VERSION
    || !Array.isArray(candidate.seenScenarioIds)
    || !candidate.seenScenarioIds.every((id) => typeof id === "string")
  ) {
    return null;
  }
  return {
    version: CLIENT_TIMELINE_STORAGE_VERSION,
    seenScenarioIds: [...new Set(candidate.seenScenarioIds)],
  };
}

export function clientTimelineReducer(
  state: ClientTimelineState,
  action: ClientTimelineAction,
): ClientTimelineState {
  switch (action.type) {
    case "HYDRATE":
      if (state.phase !== "ready") return state;
      return { ...state, seenScenarioIds: action.payload.seenScenarioIds };
    case "START":
      return {
        ...state,
        phase: "client-intro",
        activeScenario: action.scenario,
        currentStopIndex: 0,
        pendingStopIndex: null,
        choices: [],
        displayedOptionIdsByStop: {},
        sessionKey: state.sessionKey + 1,
      };
    case "BEGIN_TIMELINE":
      if (state.phase !== "client-intro") return state;
      return {
        ...state,
        phase: "stop-decision",
        displayedOptionIdsByStop: {
          ...state.displayedOptionIdsByStop,
          [action.stopId]: action.optionIds,
        },
      };
    case "SELECT_OPTION":
      if (state.phase !== "stop-decision") return state;
      return {
        ...state,
        phase: "resolving-choice",
        choices: [...state.choices, action.choice],
      };
    case "SHOW_CONSEQUENCE":
      if (state.phase !== "resolving-choice") return state;
      return { ...state, phase: "stop-consequence" };
    case "BEGIN_ADVANCE":
      if (state.phase !== "stop-consequence") return state;
      return {
        ...state,
        phase: "advancing",
        pendingStopIndex: action.pendingStopIndex,
        displayedOptionIdsByStop: {
          ...state.displayedOptionIdsByStop,
          [action.stopId]: action.optionIds,
        },
      };
    case "COMPLETE_ADVANCE":
      if (state.phase !== "advancing" || state.pendingStopIndex === null) return state;
      return {
        ...state,
        phase: "stop-decision",
        currentStopIndex: state.pendingStopIndex,
        pendingStopIndex: null,
      };
    case "SHOW_ENDING":
      if (state.phase !== "stop-consequence") return state;
      return {
        ...state,
        phase: "ending",
        pendingStopIndex: null,
        seenScenarioIds: action.seenScenarioIds,
      };
    default:
      return state;
  }
}

export function selectTimelineEnding(
  scenario: ClientTimelineScenario,
  choices: readonly TimelineChoice[],
): string {
  const disciplinedCount = choices.reduce(
    (count, choice) => count + (choice.approachTag === "disciplined" ? 1 : 0),
    0,
  );
  return disciplinedCount >= 2
    ? scenario.endingMostlyDisciplined
    : scenario.endingMostlyReactive;
}
