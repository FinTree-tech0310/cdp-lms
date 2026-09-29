import {
  DEAL_ROOM_SECTIONS,
  type DealRoomSection,
  type MathPuzzleScenario,
  type MetricTile,
} from "../_data/math-puzzle-scenarios";

export const BUILD_PITCH_STORAGE_KEY = "cdp:vc-games:build-the-pitch";
export const BUILD_PITCH_STORAGE_VERSION = 2;

export interface BuildPitchPersistence {
  version: number;
  seenSectionIds: DealRoomSection[];
  seenScenarioIdsBySection: Partial<Record<DealRoomSection, string[]>>;
  lastTileOrders: Record<string, string[]>;
}

export interface BuildPitchState {
  phase: "ready" | "playing" | "results";
  activeScenario: MathPuzzleScenario | null;
  tileOrder: MetricTile[];
  placements: Record<string, string>;
  seenSectionIds: DealRoomSection[];
  seenScenarioIdsBySection: Partial<Record<DealRoomSection, string[]>>;
  lastTileOrders: Record<string, string[]>;
}

export const INITIAL_BUILD_PITCH_STATE: BuildPitchState = {
  phase: "ready",
  activeScenario: null,
  tileOrder: [],
  placements: {},
  seenSectionIds: [],
  seenScenarioIdsBySection: {},
  lastTileOrders: {},
};

type BuildPitchAction =
  | { type: "HYDRATE"; payload: BuildPitchPersistence }
  | {
      type: "START";
      scenario: MathPuzzleScenario;
      tileOrder: MetricTile[];
      seenSectionIds: DealRoomSection[];
      seenScenarioIdsBySection: Partial<Record<DealRoomSection, string[]>>;
    }
  | { type: "PLACE_TILE"; tileId: string; slotId: string }
  | { type: "REMOVE_TILE"; tileId: string }
  | { type: "SUBMIT" };

export function buildPitchReducer(
  state: BuildPitchState,
  action: BuildPitchAction,
): BuildPitchState {
  switch (action.type) {
    case "HYDRATE":
      return {
        ...state,
        seenSectionIds: action.payload.seenSectionIds,
        seenScenarioIdsBySection: action.payload.seenScenarioIdsBySection,
        lastTileOrders: action.payload.lastTileOrders,
      };
    case "START":
      return {
        ...state,
        phase: "playing",
        activeScenario: action.scenario,
        tileOrder: action.tileOrder,
        placements: {},
        seenSectionIds: action.seenSectionIds,
        seenScenarioIdsBySection: action.seenScenarioIdsBySection,
        lastTileOrders: {
          ...state.lastTileOrders,
          [action.scenario.id]: action.tileOrder.map((tile) => tile.id),
        },
      };
    case "PLACE_TILE": {
      if (state.phase !== "playing") return state;

      const nextPlacements = Object.fromEntries(
        Object.entries(state.placements).filter(([, tileId]) => tileId !== action.tileId),
      );
      nextPlacements[action.slotId] = action.tileId;
      return { ...state, placements: nextPlacements };
    }
    case "REMOVE_TILE": {
      if (state.phase !== "playing") return state;

      return {
        ...state,
        placements: Object.fromEntries(
          Object.entries(state.placements).filter(([, tileId]) => tileId !== action.tileId),
        ),
      };
    }
    case "SUBMIT":
      return state.phase === "playing" ? { ...state, phase: "results" } : state;
    default:
      return state;
  }
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isDealRoomSection(value: unknown): value is DealRoomSection {
  return (
    typeof value === "string" && DEAL_ROOM_SECTIONS.includes(value as DealRoomSection)
  );
}

export function parseBuildPitchPersistence(value: unknown): BuildPitchPersistence | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<BuildPitchPersistence>;
  if (candidate.version !== BUILD_PITCH_STORAGE_VERSION) return null;
  if (
    !Array.isArray(candidate.seenSectionIds) ||
    !candidate.seenSectionIds.every((section) => isDealRoomSection(section))
  ) {
    return null;
  }
  if (!candidate.seenScenarioIdsBySection || typeof candidate.seenScenarioIdsBySection !== "object") {
    return null;
  }
  if (!candidate.lastTileOrders || typeof candidate.lastTileOrders !== "object") return null;

  const validScenarioHistory = Object.entries(candidate.seenScenarioIdsBySection).every(
    ([section, scenarioIds]) => isDealRoomSection(section) && isStringArray(scenarioIds),
  );
  if (!validScenarioHistory) return null;

  const validOrders = Object.entries(candidate.lastTileOrders).every(
    ([scenarioId, order]) => scenarioId.length > 0 && isStringArray(order),
  );
  if (!validOrders) return null;

  return {
    version: BUILD_PITCH_STORAGE_VERSION,
    seenSectionIds: candidate.seenSectionIds,
    seenScenarioIdsBySection: candidate.seenScenarioIdsBySection as Partial<
      Record<DealRoomSection, string[]>
    >,
    lastTileOrders: candidate.lastTileOrders as Record<string, string[]>,
  };
}
