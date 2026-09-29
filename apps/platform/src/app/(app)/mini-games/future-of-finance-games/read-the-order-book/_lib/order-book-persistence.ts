export const ORDER_BOOK_STORAGE_KEY = "cdp:future-of-finance-games:read-the-order-book:v1";

export interface OrderBookPersistence {
  version: 1;
  seenScenarioIds: string[];
}

export function parseOrderBookPersistence(value: unknown): OrderBookPersistence | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const candidate = value as Record<string, unknown>;
  if (
    candidate.version !== 1
    || !Array.isArray(candidate.seenScenarioIds)
    || !candidate.seenScenarioIds.every((id) => typeof id === "string" && id.trim())
  ) return null;
  return { version: 1, seenScenarioIds: [...new Set(candidate.seenScenarioIds as string[])] };
}
