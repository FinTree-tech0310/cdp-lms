import { selectUnseenItem } from "@/app/(app)/mini-games/vc-games/_lib/select-unseen-item";
import type { TradingScenario } from "./trading-types";

export function selectTradingScenario(scenarios: readonly TradingScenario[], seenIds: readonly string[]): TradingScenario {
  return selectUnseenItem(scenarios, seenIds, "Build the Trading Algorithm needs at least one scenario.");
}

export function validTradingSeenIds(scenarios: readonly TradingScenario[], seenIds: readonly string[]): string[] {
  const valid = new Set(scenarios.map(({ id }) => id));
  return [...new Set(seenIds.filter((id) => valid.has(id)))];
}
