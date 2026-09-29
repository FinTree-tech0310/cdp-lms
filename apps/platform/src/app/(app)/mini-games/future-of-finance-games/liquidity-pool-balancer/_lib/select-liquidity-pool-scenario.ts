import { selectUnseenItem } from "@/app/(app)/mini-games/vc-games/_lib/select-unseen-item";
import type { LiquidityPoolScenario } from "./liquidity-pool-types";

export function selectLiquidityPoolScenario(
  scenarios: readonly LiquidityPoolScenario[],
  seenIds: readonly string[],
): LiquidityPoolScenario {
  return selectUnseenItem(scenarios, seenIds, "Liquidity Pool Balancer needs at least one scenario.");
}

export function validLiquidityPoolSeenIds(
  scenarios: readonly LiquidityPoolScenario[],
  seenIds: readonly string[],
): string[] {
  const valid = new Set(scenarios.map(({ id }) => id));
  return [...new Set(seenIds.filter((id) => valid.has(id)))];
}
