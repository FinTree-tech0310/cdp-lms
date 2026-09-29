import { selectUnseenItem } from "@/app/(app)/mini-games/vc-games/_lib/select-unseen-item";

import type { OrderBookScenario } from "./order-book-types";

export function validOrderBookSeenIds(
  scenarios: readonly OrderBookScenario[],
  seenIds: readonly string[],
): string[] {
  const validIds = new Set(scenarios.map(({ id }) => id));
  return [...new Set(seenIds)].filter((id) => validIds.has(id));
}

export function selectOrderBookScenario(
  scenarios: readonly OrderBookScenario[],
  seenIds: readonly string[],
): OrderBookScenario {
  return selectUnseenItem(
    scenarios,
    validOrderBookSeenIds(scenarios, seenIds),
    "Read the Order Book requires a scenario.",
  );
}
