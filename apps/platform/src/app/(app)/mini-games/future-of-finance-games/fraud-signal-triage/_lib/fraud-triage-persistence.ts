export const FRAUD_TRIAGE_STORAGE_KEY = "cdp:future-of-finance-games:fraud-signal-triage:v1";

export interface FraudTriagePersistence {
  version: 1;
  seenScenarioIds: string[];
}

export function parseFraudTriagePersistence(value: unknown): FraudTriagePersistence | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const candidate = value as Record<string, unknown>;
  if (
    candidate.version !== 1
    || !Array.isArray(candidate.seenScenarioIds)
    || !candidate.seenScenarioIds.every((id) => typeof id === "string" && id.trim().length > 0)
  ) return null;
  return { version: 1, seenScenarioIds: [...new Set(candidate.seenScenarioIds as string[])] };
}
