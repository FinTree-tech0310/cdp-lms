export const LIQUIDITY_POOL_STORAGE_KEY = "cdp:future-of-finance-games:liquidity-pool-balancer:v1";

export interface LiquidityPoolPersistence {
  version: 1;
  seenScenarioIds: string[];
}

export function parseLiquidityPoolPersistence(value: unknown): LiquidityPoolPersistence | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Record<string, unknown>;
  if (candidate.version !== 1 || !Array.isArray(candidate.seenScenarioIds)
    || !candidate.seenScenarioIds.every((id) => typeof id === "string")) return null;
  return { version: 1, seenScenarioIds: [...new Set(candidate.seenScenarioIds)] };
}
