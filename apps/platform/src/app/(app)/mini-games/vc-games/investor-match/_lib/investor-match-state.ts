import type {
  InvestorArchetype,
  InvestorMatchScenario,
  InvestorOffer,
} from "../_data/investor-match-scenarios";

export const INVESTOR_MATCH_STORAGE_KEY = "cdp:vc-games:investor-match";
export const INVESTOR_MATCH_STORAGE_VERSION = 1;

export interface InvestorMatchPersistence {
  version: number;
  recentScenarioIds: string[];
  lastOfferOrders: Record<string, InvestorArchetype[]>;
}

export interface InvestorMatchState {
  phase: "ready" | "choosing" | "outcome";
  activeScenario: InvestorMatchScenario | null;
  offerOrder: InvestorOffer[];
  selectedArchetype: InvestorArchetype | null;
  showOtherPaths: boolean;
  recentScenarioIds: string[];
  lastOfferOrders: Record<string, InvestorArchetype[]>;
}

export const INITIAL_INVESTOR_MATCH_STATE: InvestorMatchState = {
  phase: "ready",
  activeScenario: null,
  offerOrder: [],
  selectedArchetype: null,
  showOtherPaths: false,
  recentScenarioIds: [],
  lastOfferOrders: {},
};

type InvestorMatchAction =
  | { type: "HYDRATE"; payload: InvestorMatchPersistence }
  | {
      type: "START";
      scenario: InvestorMatchScenario;
      offerOrder: InvestorOffer[];
      recentScenarioIds: string[];
    }
  | { type: "CHOOSE"; archetype: InvestorArchetype }
  | { type: "REVEAL_OTHER_PATHS" };

export function investorMatchReducer(
  state: InvestorMatchState,
  action: InvestorMatchAction,
): InvestorMatchState {
  switch (action.type) {
    case "HYDRATE":
      return {
        ...state,
        recentScenarioIds: action.payload.recentScenarioIds,
        lastOfferOrders: action.payload.lastOfferOrders,
      };
    case "START":
      return {
        ...state,
        phase: "choosing",
        activeScenario: action.scenario,
        offerOrder: action.offerOrder,
        selectedArchetype: null,
        showOtherPaths: false,
        recentScenarioIds: action.recentScenarioIds,
        lastOfferOrders: {
          ...state.lastOfferOrders,
          [action.scenario.id]: action.offerOrder.map((offer) => offer.archetype),
        },
      };
    case "CHOOSE":
      if (state.phase !== "choosing") return state;
      return { ...state, phase: "outcome", selectedArchetype: action.archetype };
    case "REVEAL_OTHER_PATHS":
      return state.phase === "outcome" ? { ...state, showOtherPaths: true } : state;
    default:
      return state;
  }
}

const ARCHETYPES: readonly InvestorArchetype[] = ["fast", "patient", "network"];

function isArchetype(value: unknown): value is InvestorArchetype {
  return typeof value === "string" && ARCHETYPES.includes(value as InvestorArchetype);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function parseInvestorMatchPersistence(value: unknown): InvestorMatchPersistence | null {
  if (!value || typeof value !== "object") return null;

  const candidate = value as Partial<InvestorMatchPersistence>;
  if (candidate.version !== INVESTOR_MATCH_STORAGE_VERSION) return null;
  if (!isStringArray(candidate.recentScenarioIds)) return null;
  if (!candidate.lastOfferOrders || typeof candidate.lastOfferOrders !== "object") return null;

  const validOrders = Object.entries(candidate.lastOfferOrders).every(
    ([scenarioId, order]) =>
      scenarioId.length > 0 && Array.isArray(order) && order.every((item) => isArchetype(item)),
  );
  if (!validOrders) return null;

  return {
    version: INVESTOR_MATCH_STORAGE_VERSION,
    recentScenarioIds: candidate.recentScenarioIds,
    lastOfferOrders: candidate.lastOfferOrders as Record<string, InvestorArchetype[]>,
  };
}
