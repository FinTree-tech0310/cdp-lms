import {
  selectUnseenItem,
  updateSeenItemIds,
} from "@/app/(app)/mini-games/vc-games/_lib/select-unseen-item";

import type {
  PushBackRequest,
  PushBackSet,
} from "../_data/push-back-sets";

export interface PushBackSessionSelection {
  requests: PushBackRequest[];
  seenSetIds: string[];
}

function shuffleRequests(
  requests: readonly PushBackRequest[],
): PushBackRequest[] {
  const shuffled = [...requests];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

export function selectPushBackSession(
  sets: readonly PushBackSet[],
  seenSetIds: readonly string[],
): PushBackSessionSelection {
  const availableSetIds = new Set(sets.map((set) => set.id));
  const validSeenSetIds = [
    ...new Set(seenSetIds.filter((id) => availableSetIds.has(id))),
  ];
  const selectedSet = selectUnseenItem(
    sets,
    validSeenSetIds,
    "Would You Push Back needs at least one request set.",
  );

  return {
    requests: shuffleRequests(selectedSet.requests),
    seenSetIds: updateSeenItemIds(
      validSeenSetIds,
      selectedSet.id,
      sets.length,
    ),
  };
}
