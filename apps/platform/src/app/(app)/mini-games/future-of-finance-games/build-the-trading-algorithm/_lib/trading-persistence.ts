export const TRADING_STORAGE_KEY = "cdp:future-of-finance-games:build-the-trading-algorithm:v1";

export interface TradingPersistence {
  version: 1;
  seenScenarioIds: string[];
}

export function parseTradingPersistence(value: unknown): TradingPersistence | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Record<string, unknown>;
  if (candidate.version !== 1 || !Array.isArray(candidate.seenScenarioIds)
    || !candidate.seenScenarioIds.every((id) => typeof id === "string")) return null;
  return { version: 1, seenScenarioIds: [...new Set(candidate.seenScenarioIds)] };
}
