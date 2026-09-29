import type { ClientDossierCard } from "../_data/client-dossiers";

export const CLIENT_DOSSIER_STORAGE_KEY =
  "cdp:private-wealth-games:client-dossier:v2";
export const CLIENT_DOSSIER_STORAGE_VERSION = 2;

export type ClientDossierDecision = "honor" | "push-back" | "skipped";
export type ClientDossierPhase = "ready" | "playing" | "results";

export interface ClientDossierPersistence {
  version: typeof CLIENT_DOSSIER_STORAGE_VERSION;
  seenSetIds: string[];
}

export interface ClientDossierState {
  phase: ClientDossierPhase;
  dossiers: ClientDossierCard[];
  activeIndex: number;
  responses: Record<string, ClientDossierDecision>;
  resolvingDecision: ClientDossierDecision | null;
  seenSetIds: string[];
  sessionKey: number;
}

export type ClientDossierAction =
  | { type: "HYDRATE"; payload: ClientDossierPersistence }
  | {
      type: "START_SESSION";
      dossiers: ClientDossierCard[];
      seenSetIds: string[];
    }
  | {
      type: "RECORD_DECISION";
      dossierId: string;
      decision: ClientDossierDecision;
    }
  | { type: "ADVANCE" };

export const INITIAL_CLIENT_DOSSIER_STATE: ClientDossierState = {
  phase: "ready",
  dossiers: [],
  activeIndex: 0,
  responses: {},
  resolvingDecision: null,
  seenSetIds: [],
  sessionKey: 0,
};

export function parseClientDossierPersistence(
  value: unknown,
): ClientDossierPersistence | null {
  if (!value || typeof value !== "object") return null;

  const candidate = value as Partial<ClientDossierPersistence>;
  if (
    candidate.version !== CLIENT_DOSSIER_STORAGE_VERSION
    || !Array.isArray(candidate.seenSetIds)
    || !candidate.seenSetIds.every((id) => typeof id === "string")
  ) {
    return null;
  }

  return {
    version: CLIENT_DOSSIER_STORAGE_VERSION,
    seenSetIds: [...new Set(candidate.seenSetIds)],
  };
}

export function clientDossierReducer(
  state: ClientDossierState,
  action: ClientDossierAction,
): ClientDossierState {
  switch (action.type) {
    case "HYDRATE":
      if (state.phase !== "ready") return state;
      return { ...state, seenSetIds: action.payload.seenSetIds };
    case "START_SESSION":
      return {
        ...state,
        phase: "playing",
        dossiers: action.dossiers,
        activeIndex: 0,
        responses: {},
        resolvingDecision: null,
        seenSetIds: action.seenSetIds,
        sessionKey: state.sessionKey + 1,
      };
    case "RECORD_DECISION":
      if (state.phase !== "playing" || state.resolvingDecision !== null) {
        return state;
      }
      return {
        ...state,
        responses: {
          ...state.responses,
          [action.dossierId]: action.decision,
        },
        resolvingDecision: action.decision,
      };
    case "ADVANCE":
      if (state.phase !== "playing" || state.resolvingDecision === null) {
        return state;
      }
      if (state.activeIndex >= state.dossiers.length - 1) {
        return { ...state, phase: "results" };
      }
      return {
        ...state,
        activeIndex: state.activeIndex + 1,
        resolvingDecision: null,
      };
    default:
      return state;
  }
}
