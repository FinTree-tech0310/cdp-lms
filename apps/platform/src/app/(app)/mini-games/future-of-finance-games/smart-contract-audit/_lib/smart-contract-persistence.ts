export const SMART_CONTRACT_STORAGE_KEY = "cdp:future-of-finance-games:smart-contract-audit:v1";

export interface SmartContractPersistence {
  version: 1;
  seenScenarioIds: string[];
}

export function parseSmartContractPersistence(value: unknown): SmartContractPersistence | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const candidate = value as Record<string, unknown>;
  if (
    candidate.version !== 1
    || !Array.isArray(candidate.seenScenarioIds)
    || !candidate.seenScenarioIds.every((id) => typeof id === "string" && id.trim())
  ) return null;
  return { version: 1, seenScenarioIds: [...new Set(candidate.seenScenarioIds as string[])] };
}
