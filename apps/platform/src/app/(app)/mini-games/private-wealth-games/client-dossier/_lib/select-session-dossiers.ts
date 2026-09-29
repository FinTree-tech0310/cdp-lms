import {
  selectUnseenItem,
  updateSeenItemIds,
} from "@/app/(app)/mini-games/vc-games/_lib/select-unseen-item";

import type {
  ClientDossierCard,
  ClientDossierSet,
} from "../_data/client-dossiers";

export const DOSSIERS_PER_SESSION = 6;

export interface DossierSessionSelection {
  dossiers: ClientDossierCard[];
  seenSetIds: string[];
}

function shuffleDossiers(
  dossiers: readonly ClientDossierCard[],
): ClientDossierCard[] {
  const shuffled = [...dossiers];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

export function selectSessionDossiers(
  sets: readonly ClientDossierSet[],
  seenSetIds: readonly string[],
): DossierSessionSelection {
  const setIds = new Set(sets.map((set) => set.id));
  const validSeenSetIds = [
    ...new Set(seenSetIds.filter((id) => setIds.has(id))),
  ];
  const selectedSet = selectUnseenItem(
    sets,
    validSeenSetIds,
    "Client Dossier needs at least one dossier set.",
  );
  const nextSeenSetIds = updateSeenItemIds(
    validSeenSetIds,
    selectedSet.id,
    sets.length,
  );

  return {
    dossiers: shuffleDossiers(selectedSet.dossiers).slice(
      0,
      DOSSIERS_PER_SESSION,
    ),
    seenSetIds: nextSeenSetIds,
  };
}
