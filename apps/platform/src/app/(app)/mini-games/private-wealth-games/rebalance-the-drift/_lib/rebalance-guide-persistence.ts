export const REBALANCE_GUIDE_STORAGE_KEY =
  "cdp:private-wealth-games:rebalance-the-drift:guide:v1";
export const REBALANCE_GUIDE_STORAGE_VERSION = 1;

interface RebalanceGuidePersistence {
  version: typeof REBALANCE_GUIDE_STORAGE_VERSION;
  seen: true;
}

export function hasSeenRebalanceGuide(): boolean {
  try {
    const raw = window.localStorage.getItem(REBALANCE_GUIDE_STORAGE_KEY);
    if (!raw) return false;
    const value = JSON.parse(raw) as Partial<RebalanceGuidePersistence>;
    return value.version === REBALANCE_GUIDE_STORAGE_VERSION && value.seen === true;
  } catch {
    return false;
  }
}

export function markRebalanceGuideSeen(): void {
  try {
    window.localStorage.setItem(
      REBALANCE_GUIDE_STORAGE_KEY,
      JSON.stringify({
        version: REBALANCE_GUIDE_STORAGE_VERSION,
        seen: true,
      } satisfies RebalanceGuidePersistence),
    );
  } catch {
    // The guide remains usable when localStorage is unavailable.
  }
}
